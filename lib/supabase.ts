import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pvvstmqtpdwiqqnklmeu.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2dnN0bXF0cGR3aXFxbmtsbWV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzOTc2MjcsImV4cCI6MjA3OTk3MzYyN30.D2xlnaIKKVZEyXwZoHuHLJcUV-irz49aSuNCL1mTDSQ'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
