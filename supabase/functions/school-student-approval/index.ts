import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SchoolStudentApprovalRequest {
  action: "approve" | "reject" | "bulk_approve" | "bulk_reject";
  schoolId: string; // This is school_id from schools table (login ID)
  schoolUuid: string; // This is the actual UUID of the school
  studentId?: string;
  studentIds?: string[]; // For bulk operations
  rejectionReason?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = (await req.json()) as SchoolStudentApprovalRequest;

    // Validate required fields
    if (!body?.action || !body?.schoolId || !body?.schoolUuid) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // For single operations, require studentId. For bulk operations, require studentIds
    const isBulk = body.action === "bulk_approve" || body.action === "bulk_reject";
    if (!isBulk && !body.studentId) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing student ID" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (isBulk && (!body.studentIds || body.studentIds.length === 0)) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing student IDs for bulk operation" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing backend env vars: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
      return new Response(
        JSON.stringify({ success: false, error: "Backend configuration error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const admin = createClient(supabaseUrl, supabaseServiceKey);

    // Validate school by UUID - this is more secure than password check
    const { data: school, error: schoolError } = await admin
      .from("schools")
      .select("id, name, school_id, is_banned, fee_paid")
      .eq("id", body.schoolUuid)
      .eq("school_id", body.schoolId)
      .maybeSingle();

    if (schoolError) {
      console.error("School lookup error:", schoolError);
      return new Response(
        JSON.stringify({ success: false, error: "School validation failed" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!school) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid school session" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if school is banned or fee not paid
    if (school.is_banned) {
      return new Response(
        JSON.stringify({ success: false, error: "School is banned" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (school.fee_paid === false) {
      return new Response(
        JSON.stringify({ success: false, error: "School access suspended due to unpaid fees" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Handle bulk operations
    if (isBulk) {
      const studentIds = body.studentIds!;
      
      // Verify all students belong to this school
      const { data: students, error: studentsError } = await admin
        .from("students")
        .select("id, school_id")
        .in("id", studentIds);

      if (studentsError) {
        console.error("Students lookup error:", studentsError);
        return new Response(
          JSON.stringify({ success: false, error: "Students lookup failed" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Check if all students belong to this school
      const invalidStudents = students?.filter(s => s.school_id !== school.id) || [];
      if (invalidStudents.length > 0) {
        return new Response(
          JSON.stringify({ success: false, error: "Some students do not belong to this school" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (body.action === "bulk_approve") {
        const { error: updateError } = await admin
          .from("students")
          .update({
            is_approved: true,
            approved_at: new Date().toISOString(),
            rejection_reason: null,
          })
          .in("id", studentIds);

        if (updateError) {
          console.error("Bulk approve error:", updateError);
          return new Response(
            JSON.stringify({ success: false, error: "Failed to approve students" }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        return new Response(
          JSON.stringify({ success: true, status: "approved", count: studentIds.length }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Bulk reject
      const reason = (body.rejectionReason || "No reason provided").trim();
      const { error: rejectError } = await admin
        .from("students")
        .update({
          is_approved: false,
          rejection_reason: reason,
        })
        .in("id", studentIds);

      if (rejectError) {
        console.error("Bulk reject error:", rejectError);
        return new Response(
          JSON.stringify({ success: false, error: "Failed to reject students" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, status: "rejected", count: studentIds.length }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Single student operations
    const { data: student, error: studentError } = await admin
      .from("students")
      .select("id, school_id")
      .eq("id", body.studentId)
      .maybeSingle();

    if (studentError) {
      console.error("Student lookup error:", studentError);
      return new Response(
        JSON.stringify({ success: false, error: "Student lookup failed" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!student || student.school_id !== school.id) {
      return new Response(
        JSON.stringify({ success: false, error: "Student not found for this school" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (body.action === "approve") {
      const { error: updateError } = await admin
        .from("students")
        .update({
          is_approved: true,
          approved_at: new Date().toISOString(),
          rejection_reason: null,
        })
        .eq("id", body.studentId);

      if (updateError) {
        console.error("Approve update error:", updateError);
        return new Response(
          JSON.stringify({ success: false, error: "Failed to approve student" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, status: "approved" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const reason = (body.rejectionReason || "No reason provided").trim();

    const { error: rejectError } = await admin
      .from("students")
      .update({
        is_approved: false,
        rejection_reason: reason,
      })
      .eq("id", body.studentId);

    if (rejectError) {
      console.error("Reject update error:", rejectError);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to reject student" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, status: "rejected" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("school-student-approval error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

Deno.serve(handler);
