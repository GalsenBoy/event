import { useEffect, useState } from 'react'
import 'react-native-url-polyfill/auto'

import Auth from '@/components/auth/Auth'
import { supabase } from '@/lib/supabaseClient'
import { Session } from '@supabase/supabase-js'
import { ScrollView, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Authentification() {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return (
    <SafeAreaView style={{ flex: 1 }}>
     <ScrollView>
       <Auth />
      {session && session.user && <Text>{session.user.id}</Text>}
     </ScrollView>
    </SafeAreaView>
  )
}