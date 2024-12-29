'use client'

import { useState, useEffect } from 'react'
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Loader2, Copy, Check } from 'lucide-react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useToast } from "@/hooks/use-toast"

export default function CodePage() {
  const [prompt, setPrompt] = useState('')
  const [generatedCode, setGeneratedCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setGeneratedCode('')

    const response = await fetch('/api/code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    })

    if (!response.body) {
      setLoading(false)
      return
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const chunk = decoder.decode(value)
      setGeneratedCode((prev) => prev + chunk)
    }

    setLoading(false)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode)
    setCopied(true)
    toast({
      title: "Code copied",
      description: "The generated code has been copied to your clipboard.",
    })
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center">Code Generator</h1>
      <Card>
        <CardHeader>
          <CardTitle>Generate Code</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              placeholder="Enter code prompt..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
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
                'Generate Code'
              )}
            </Button>
          </form>
          {generatedCode && (
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold">Generated Code:</h2>
                <Button onClick={handleCopy} variant="outline" size="sm">
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <SyntaxHighlighter 
                language="javascript" 
                style={tomorrow}
                customStyle={{
                  borderRadius: '0.375rem',
                }}
              >
                {generatedCode}
              </SyntaxHighlighter>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

