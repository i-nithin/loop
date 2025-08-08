const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-user-id',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    const userId = req.headers.get('x-user-id')
    
    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'User ID required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const { data: announcements, error } = await supabaseClient
      .from('announcements')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'published')
      .order('published_at', { ascending: false })

    if (error) {
      throw error
    }

    const transformedAnnouncements = announcements?.map(item => ({
      id: item.id,
      title: item.title,
      content: item.content,
      type: item.type,
      priority: item.priority,
      status: item.status,
      publishedAt: item.published_at,
      createdAt: item.created_at,
      imageUrl: item.image_url,
      linkUrl: item.link_url,
      linkText: item.link_text
    })) || []

    return new Response(
      JSON.stringify(transformedAnnouncements),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})