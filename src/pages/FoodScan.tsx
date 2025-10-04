import React, { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useStore } from '@/store/useStore'

function useQuery() {
  const { search } = useLocation()
  return useMemo(() => new URLSearchParams(search), [search])
}

export default function FoodScan() {
  const query = useQuery()
  const navigate = useNavigate()
  const token = query.get('token') || ''

  const redeemFoodToken = useStore(s => s.redeemFoodToken)
  const logout = useStore(s => s.logout)
  const teams = useStore(s => s.teams)

  const result = token ? redeemFoodToken(token) : { ok: false, message: 'No token' as const }
  const team = result.teamProgress ? teams[result.teamProgress.teamId] : undefined

  return (
    <div className="max-w-md mx-auto mt-16 card p-6 text-center">
      <h1 className="text-2xl font-bold mb-2">{result.ok ? 'Coupon Redeemed' : 'Redemption Status'}</h1>
      <p className="text-slate-300 mb-4">{result.message}</p>

      {result.teamProgress && (
        <div className="mb-4">
          <div className="text-sm text-slate-300">Team: <span className="font-semibold">{team?.name || result.teamProgress.teamId}</span></div>
          <div className="text-sm text-blue-300">{result.teamProgress.redeemed}/{result.teamProgress.total} redeemed</div>
        </div>
      )}

      <button
        className="btn-primary w-full"
        onClick={() => {
          logout()
          navigate('/login')
        }}
      >
        Logout
      </button>
    </div>
  )
}
