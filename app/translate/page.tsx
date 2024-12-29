'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from 'lucide-react'

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese' },
]

export default function TranslatePage() {
  const [text, setText] = useState('')
  const [sourceLang, setSourceLang] = useState('en')
  const [targetLang, setTargetLang] = useState('es')
  const [translatedText, setTranslatedText] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, source_lang: sourceLang, target_lang: targetLang }),
      })
      const data = await response.json()
      setTranslatedText(data.translated_text)
    } catch (error) {
      console.error('Error translating text:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center">Translator</h1>
      <Card>
        <CardHeader>
          <CardTitle>Translate Text</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="Enter text to translate..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full"
            />
            <div className="flex space-x-4">
              <Select value={sourceLang} onValueChange={setSourceLang}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Source Language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={targetLang} onValueSelect value={targetLang} onValueChange={setTargetLang}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Target Language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Translating...
                </>
              ) : (
                'Translate'
              )}
            </Button>
          </form>
          {translatedText && (
            <div className="mt-4">
              <h2 className="text-xl font-semibold mb-2">Translated Text:</h2>
              <p className="p-4 bg-secondary rounded-md">{translatedText}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

