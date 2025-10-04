import React, { useState } from 'react'
import { uid } from '@/utils/id'
import { useStore } from '@/store/useStore'

export default function CreateHackathon() {
  const createHackathon = useStore(s => s.createHackathon)
  const currentUserId = useStore(s => s.session.currentUserId)
  const currentUser = useStore(s => currentUserId ? s.users[currentUserId] : undefined)
  const [title, setTitle] = useState('')
  const org = currentUser?.name || ''
  const [dateRange, setDateRange] = useState('')
  const [tags, setTags] = useState<string>('')
  // Prize configuration
  const [prizeMode, setPrizeMode] = useState<'overall' | 'perProblem' | ''>('')
  const [prizePool, setPrizePool] = useState<string>('')
  const [firstPrize, setFirstPrize] = useState<string>('')
  const [secondPrize, setSecondPrize] = useState<string>('')
  const [thirdPrize, setThirdPrize] = useState<string>('')
  const [description, setDescription] = useState('')

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !dateRange) {
      alert('Please complete title and dates')
      return
    }
    // Build prize string based on mode
    let prize = ''
    if (prizeMode === 'overall') {
      prize = `Prize Pool: ${prizePool || 'TBD'}; 1st: ${firstPrize || 'TBD'}; 2nd: ${secondPrize || 'TBD'}; 3rd: ${thirdPrize || 'TBD'}`
    } else if (prizeMode === 'perProblem') {
      prize = 'Prizes per problem statements'
    }
    const id = createHackathon({
      title,
      org,
      dateRange,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      prize,
      description,
      // Default judging criteria (hidden from form)
      criteria: [{ id: uid('c'), label: 'Innovation', max: 10 }],
    })
    alert('Hackathon created! ID: ' + id)
    setTitle(''); setDateRange(''); setTags(''); setPrizeMode(''); setPrizePool(''); setFirstPrize(''); setSecondPrize(''); setThirdPrize(''); setDescription('')
  }

  return (
    <div className="mx-auto max-w-3xl card p-6">
      <h2 className="text-xl font-semibold">Create Hackathon</h2>
      <form className="mt-4 space-y-4" onSubmit={onSubmit}>
        <input className="input" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
        <div className="grid gap-3 sm:grid-cols-2">
          <input className="input" placeholder="Organizer Name" value={org} readOnly disabled />
          <input className="input" placeholder="Date Range (e.g. Oct 15 - Oct 17)" value={dateRange} onChange={e => setDateRange(e.target.value)} />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <input className="input" placeholder="Domain" value={tags} onChange={e => setTags(e.target.value)} />
          <div className="input bg-transparent p-0 border-0">
            <div className="grid gap-2">
              <div className="grid grid-cols-2 gap-2">
                <label className="text-sm text-slate-300 flex items-center gap-2">
                  <input type="radio" name="prizeMode" checked={prizeMode==='perProblem'} onChange={()=>setPrizeMode('perProblem')} />
                  Per problem statements
                </label>
                <label className="text-sm text-slate-300 flex items-center gap-2">
                  <input type="radio" name="prizeMode" checked={prizeMode==='overall'} onChange={()=>setPrizeMode('overall')} />
                  Overall (1st/2nd/3rd)
                </label>
              </div>
              {prizeMode === 'overall' && (
                <div className="grid gap-2 sm:grid-cols-4">
                  <input className="input" placeholder="Prize Pool" value={prizePool} onChange={e => setPrizePool(e.target.value)} />
                  <input className="input" placeholder="1st" value={firstPrize} onChange={e => setFirstPrize(e.target.value)} />
                  <input className="input" placeholder="2nd" value={secondPrize} onChange={e => setSecondPrize(e.target.value)} />
                  <input className="input" placeholder="3rd" value={thirdPrize} onChange={e => setThirdPrize(e.target.value)} />
                </div>
              )}
              {prizeMode === 'perProblem' && (
                <div className="text-xs text-slate-400">Prizes will be specified per problem statements.</div>
              )}
            </div>
          </div>
        </div>
        <textarea className="input" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />

        <button className="btn-primary" type="submit">Create</button>
      </form>
    </div>
  )
}
