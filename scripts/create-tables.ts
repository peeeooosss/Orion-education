import { neon } from "@neondatabase/serverless";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL required");
  process.exit(1);
}

const sql = neon(DATABASE_URL);

const stmts = [
  `CREATE TABLE IF NOT EXISTS users (id text PRIMARY KEY, email text NOT NULL UNIQUE, password_hash text NOT NULL, name text NOT NULL, phone text, role text NOT NULL DEFAULT 'student', city text, state text, active boolean NOT NULL DEFAULT true, created_at timestamptz NOT NULL DEFAULT now())`,
  `CREATE TABLE IF NOT EXISTS agents (id text PRIMARY KEY REFERENCES users(id), daily_target integer DEFAULT 40, avatar_color text DEFAULT '#6366f1', leads_assigned integer DEFAULT 0, calls_made integer DEFAULT 0, calls_connected integer DEFAULT 0, conversions integer DEFAULT 0)`,
  `CREATE TABLE IF NOT EXISTS contacts (id text PRIMARY KEY, name text NOT NULL, phone text NOT NULL, email text, city text, state text, created_at timestamptz NOT NULL DEFAULT now())`,
  `CREATE UNIQUE INDEX IF NOT EXISTS contacts_phone_idx ON contacts(phone)`,
  `CREATE TABLE IF NOT EXISTS leads (id text PRIMARY KEY, contact_id text REFERENCES contacts(id), agent_id text REFERENCES agents(id), stage text NOT NULL DEFAULT 'New', source text NOT NULL, lead_type text NOT NULL, looking_for text, target_college text, target_program text, scholarship_amount numeric DEFAULT '0', scholarship_applied boolean DEFAULT false, payment_status text DEFAULT 'Not Required', payment_id text, intent_level text DEFAULT 'Cold', intent_score integer DEFAULT 0, intent_reasons jsonb DEFAULT '[]', score_band text, stream text, call_status text DEFAULT 'Not Called', interest_status text DEFAULT 'Not Assessed', next_action text, call_connected boolean DEFAULT false, last_called_at timestamptz, next_follow_up_at timestamptz, raw_student_id text, assigned_by text, assigned_at timestamptz, assignment_note text, questionnaire jsonb, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now())`,
  `CREATE TABLE IF NOT EXISTS lead_activities (id text PRIMARY KEY, lead_id text NOT NULL REFERENCES leads(id), agent_id text REFERENCES agents(id), kind text NOT NULL, call_result text, interest text, next_action text, note text, old_stage text, new_stage text, created_at timestamptz NOT NULL DEFAULT now())`,
  `CREATE TABLE IF NOT EXISTS follow_ups (id text PRIMARY KEY, lead_id text NOT NULL REFERENCES leads(id), agent_id text NOT NULL REFERENCES agents(id), due_at timestamptz NOT NULL, follow_type text DEFAULT 'Call', priority text DEFAULT 'Normal', note text, completed boolean DEFAULT false, completed_at timestamptz, created_at timestamptz NOT NULL DEFAULT now())`,
  `CREATE TABLE IF NOT EXISTS questionnaires (id text PRIMARY KEY, lead_id text REFERENCES leads(id), user_id text REFERENCES users(id), data jsonb NOT NULL, completed_at timestamptz, created_at timestamptz NOT NULL DEFAULT now())`,
  `CREATE TABLE IF NOT EXISTS scholarship_payments (id text PRIMARY KEY, user_id text REFERENCES users(id), lead_id text REFERENCES leads(id), contact_id text REFERENCES contacts(id), amount numeric NOT NULL DEFAULT '99', currency text DEFAULT 'INR', purpose text DEFAULT 'Scholarship Check', status text DEFAULT 'Initiated', primary_college text, college_ids jsonb DEFAULT '[]', paid_at timestamptz, created_at timestamptz NOT NULL DEFAULT now())`,
  `CREATE TABLE IF NOT EXISTS vouchers (id text PRIMARY KEY, code text NOT NULL UNIQUE, lead_id text REFERENCES leads(id), contact_id text REFERENCES contacts(id), amount numeric NOT NULL, primary_college text, stream text, status text DEFAULT 'Active', issued_at timestamptz NOT NULL DEFAULT now(), expires_at timestamptz NOT NULL, per_college jsonb DEFAULT '[]')`,
  `CREATE TABLE IF NOT EXISTS applications (id text PRIMARY KEY, lead_id text NOT NULL REFERENCES leads(id), contact_id text REFERENCES contacts(id), agent_id text REFERENCES agents(id), college_id text, college_name text, program text, scholarship numeric DEFAULT '0', stage text DEFAULT 'Docs Pending', notes text, started_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now())`,
  `CREATE TABLE IF NOT EXISTS application_documents (id text PRIMARY KEY, application_id text NOT NULL REFERENCES applications(id), name text NOT NULL, required boolean DEFAULT true, done boolean DEFAULT false)`,
  `CREATE TABLE IF NOT EXISTS application_events (id text PRIMARY KEY, application_id text NOT NULL REFERENCES applications(id), label text NOT NULL, created_at timestamptz NOT NULL DEFAULT now())`,
  `CREATE TABLE IF NOT EXISTS colleges (id text PRIMARY KEY, name text NOT NULL, short_name text, city text, established integer, rating numeric, type text, about text, tags jsonb DEFAULT '[]', accreditation jsonb DEFAULT '[]', ranking text, admissions jsonb, costs jsonb, scholarships jsonb, placement_pct numeric, highest_placement numeric, intake integer, facilities jsonb DEFAULT '[]', source_website text, cover_image text, budget numeric DEFAULT '80000')`,
  `CREATE TABLE IF NOT EXISTS programs (id text PRIMARY KEY, college_id text NOT NULL REFERENCES colleges(id), name text NOT NULL, stream text, duration_years integer, annual_fee numeric, total_fee numeric, avg_placement numeric, eligibility text, intakes jsonb DEFAULT '[]', seats integer)`,
  `CREATE TABLE IF NOT EXISTS raw_import_batches (id text PRIMARY KEY, file_name text NOT NULL, sheet_name text, imported_at timestamptz NOT NULL DEFAULT now(), imported_by text, row_count integer, headers jsonb DEFAULT '[]')`,
  `CREATE TABLE IF NOT EXISTS raw_students (id text PRIMARY KEY, batch_id text REFERENCES raw_import_batches(id), source_file text, imported_at timestamptz NOT NULL DEFAULT now(), student_name text, phone text, email text, city text, state text, stream text, score_band text, entrance_exam text, entrance_score text, preferred_college text, preferred_program text, budget_range text, hostel_required boolean DEFAULT false, loan_required boolean DEFAULT false, admission_timeline text, assigned_agent text, status text DEFAULT 'Unassigned', call_status text DEFAULT 'Not Called', interest_status text DEFAULT 'Not Assessed', lead_id text REFERENCES leads(id), intent_level text, intent_override boolean DEFAULT false, intent_override_reason text)`,
  `CREATE TABLE IF NOT EXISTS agent_daily_stats (id text PRIMARY KEY, agent_id text NOT NULL REFERENCES agents(id), date date NOT NULL, calls_made integer DEFAULT 0, calls_connected integer DEFAULT 0, leads_qualified integer DEFAULT 0, leads_applied integer DEFAULT 0, leads_admitted integer DEFAULT 0)`,
  `CREATE UNIQUE INDEX IF NOT EXISTS agent_daily_stats_agent_date_idx ON agent_daily_stats(agent_id, date)`,
  `CREATE TABLE IF NOT EXISTS daily_metrics (id text PRIMARY KEY, date date NOT NULL UNIQUE, total_leads integer DEFAULT 0, new_leads integer DEFAULT 0, total_calls integer DEFAULT 0, total_connected integer DEFAULT 0, total_qualified integer DEFAULT 0, total_applied integer DEFAULT 0, total_admitted integer DEFAULT 0, total_lost integer DEFAULT 0, scholarship_revenue numeric DEFAULT '0', budget_used numeric DEFAULT '0', created_at timestamptz NOT NULL DEFAULT now())`,
];

async function main() {
  console.log("🏗️  Creating tables...\n");
  for (const stmt of stmts) {
    await sql.query(stmt);
  }
  console.log("✅ All tables created.\n");
}

main().catch((err) => {
  console.error("❌ Failed:", err);
  process.exit(1);
});
