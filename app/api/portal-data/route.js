import { NextResponse } from 'next/server';
import { getMasterPortalData, saveMasterPortalData } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const { data, timestamp, source } = await getMasterPortalData();
    return NextResponse.json({
      success: true,
      data,
      timestamp,
      source
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { students, teachers, departments, batches, sections, activityLogs, key, value } = body;

    const { data: currentData } = await getMasterPortalData();
    const updatedStore = { ...currentData };

    if (Array.isArray(students) && students.length > 0) updatedStore.students = students;
    if (Array.isArray(teachers) && teachers.length > 0) updatedStore.teachers = teachers;
    if (Array.isArray(departments) && departments.length > 0) updatedStore.departments = departments;
    if (Array.isArray(batches) && batches.length > 0) updatedStore.batches = batches;
    if (Array.isArray(sections) && sections.length > 0) updatedStore.sections = sections;
    if (Array.isArray(activityLogs) && activityLogs.length > 0) updatedStore.activityLogs = activityLogs;

    if (key && value !== undefined) {
      if (key === 'vsb_students' && Array.isArray(value)) updatedStore.students = value;
      if (key === 'vsb_teachers' && Array.isArray(value)) updatedStore.teachers = value;
      if (key === 'vsb_departments' && Array.isArray(value)) updatedStore.departments = value;
      if (key === 'vsb_batches' && Array.isArray(value)) updatedStore.batches = value;
      if (key === 'vsb_sections' && Array.isArray(value)) updatedStore.sections = value;
      if (key === 'vsb_activity_logs' && Array.isArray(value)) updatedStore.activityLogs = value;
    }

    const { timestamp } = await saveMasterPortalData(updatedStore);
    return NextResponse.json({ success: true, timestamp });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
