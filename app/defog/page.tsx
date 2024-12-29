'use client'

import { useState, useEffect } from 'react'
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Loader2 } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"

export default function DefogPage() {
  const [sqlPrompt, setSqlPrompt] = useState('')
  const [generatedSql, setGeneratedSql] = useState('')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setGeneratedSql('')

    try {
      const eventSource = new EventSource(`/api/defog?sqlprompt=${encodeURIComponent(sqlPrompt)}`)

      eventSource.onmessage = (event) => {
        setGeneratedSql((prev) => prev + event.data)
      }

      eventSource.onerror = (error) => {
        console.error('Error generating SQL:', error)
        eventSource.close()
        setLoading(false)
        toast({
          title: "Error",
          description: "Failed to generate SQL. Please try again.",
          variant: "destructive",
        })
      }

      eventSource.addEventListener('end', () => {
        eventSource.close()
        setLoading(false)
      })
    } catch (error) {
      console.error('Error setting up EventSource:', error)
      setLoading(false)
      toast({
        title: "Error",
        description: "Failed to connect to the server. Please try again.",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    return () => {
      // Clean up EventSource on component unmount
      const eventSource = new EventSource(`/api/defog?sqlprompt=${encodeURIComponent(sqlPrompt)}`)
      eventSource.close()
    }
  }, [sqlPrompt])

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center">SQL Generator</h1>
      <Card>
        <CardHeader>
          <CardTitle>Generate SQL Code</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              placeholder="Enter SQL prompt..."
              value={sqlPrompt}
              onChange={(e) => setSqlPrompt(e.target.value)}
              rows={4}
              className="w-full"
            />
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate SQL'
              )}
            </Button>
          </form>
          {generatedSql && (
            <div className="mt-4">
              <h2 className="text-xl font-semibold mb-2">Generated SQL:</h2>
              <pre className="bg-secondary p-4 rounded-lg overflow-x-auto">
                <code>{generatedSql}</code>
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

