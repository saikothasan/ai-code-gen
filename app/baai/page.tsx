'use client'

import { useState } from 'react'
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Loader2 } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"

export default function BAAIPage() {
  const [input, setInput] = useState('')
  const [batchedInput, setBatchedInput] = useState('')
  const [result, setResult] = useState<{ individual: string, batched: string[] }>({ individual: '', batched: [] })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch('/api/baai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input, batchedInput: batchedInput.split('\n') }),
      })
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`)
      }
      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error('Error generating responses:', error)
      toast({
        title: "Error",
        description: "Failed to generate responses. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center">BAAI Text Generation</h1>
      <Card>
        <CardHeader>
          <CardTitle>Generate Responses</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="input" className="block text-sm font-medium mb-1">Individual Input</label>
              <Textarea
                id="input"
                placeholder="Enter individual input..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={3}
                className="w-full"
              />
            </div>
            <div>
              <label htmlFor="batchedInput" className="block text-sm font-medium mb-1">Batched Input (one per line)</label>
              <Textarea
                id="batchedInput"
                placeholder="Enter batched inputs (one per line)..."
                value={batchedInput}
                onChange={(e) => setBatchedInput(e.target.value)}
                rows={5}
                className="w-full"
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Responses'
              )}
            </Button>
          </form>
          {result.individual && (
            <div className="mt-4">
              <h2 className="text-xl font-semibold mb-2">Individual Response:</h2>
              <p className="p-4 bg-secondary rounded-md">{result.individual}</p>
            </div>
          )}
          {result.batched.length > 0 && (
            <div className="mt-4">
              <h2 className="text-xl font-semibold mb-2">Batched Responses:</h2>
              <ul className="list-disc pl-5">
                {result.batched.map((response, index) => (
                  <li key={index} className="mb-2">{response}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

