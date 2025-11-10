# Security Quick Reference

**Quick Guide für Development Team**

## ✅ Security Checklist für neue Features

### Vor jedem Commit:
- [ ] Keine Private Keys oder Secrets im Code
- [ ] Keine `console.log()` mit sensiblen Daten
- [ ] Input Validation mit Zod Schema
- [ ] Wallet Addresses als `.toLowerCase()` normalisiert
- [ ] Error Messages sanitized (keine DB-Details an Client)

### Bei neuen API-Routes:
- [ ] Authentication mit `requireAuth()` oder `requireAdmin()`
- [ ] Rate Limiting hinzugefügt (wenn implementiert)
- [ ] Input Validation mit Zod
- [ ] Error Handling mit try-catch
- [ ] Keine Debug-Informationen in Production

### Bei Database-Queries:
- [ ] IMMER `.select()`, `.insert()`, `.eq()` verwenden
- [ ] NIEMALS String-Interpolation in Queries
- [ ] NIEMALS `.raw()` mit User-Input
- [ ] RLS Policies überprüft

### Bei User-Input:
- [ ] Zod Schema Validation
- [ ] Trim whitespace: `.trim()`
- [ ] XSS Protection: Nie `dangerouslySetInnerHTML` ohne Sanitization
- [ ] Length Limits enforced

---

## 🔒 Common Patterns

### ✅ SAFE: Authentication
```typescript
import { requireAuth } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const wallet = requireAuth(request)
  // wallet ist jetzt garantiert vorhanden und lowercase
}
```

### ✅ SAFE: Input Validation
```typescript
import { z } from 'zod'

const schema = z.object({
  title: z.string().min(1).max(200).trim(),
  amount: z.number().positive(),
})

const result = schema.safeParse(body)
if (!result.success) {
  return errorResponse(result.error.issues[0].message, 400)
}
```

### ✅ SAFE: Database Query
```typescript
const { data, error } = await supabase
  .from('proposals')
  .select('*')
  .eq('creator_wallet_address', wallet.toLowerCase())
  .single()
```

### ✅ SAFE: Error Response
```typescript
return errorResponse(
  'Failed to create proposal',
  500,
  process.env.NODE_ENV === 'development' ? error : undefined
)
```

---

## ❌ DANGEROUS: Was NICHT tun

### ❌ Private Keys im Code
```typescript
// NIEMALS!
const privateKey = "0x1234567890..."
```

### ❌ String-Interpolation in Queries
```typescript
// GEFÄHRLICH!
const query = `SELECT * FROM users WHERE wallet = '${wallet}'`
```

### ❌ Unvalidierter User-Input
```typescript
// GEFÄHRLICH!
const { title } = await request.json()
await supabase.from('proposals').insert({ title })
```

### ❌ Sensitive Daten in Errors
```typescript
// GEFÄHRLICH!
return errorResponse(`Database error: ${error.message}`, 500)
```

### ❌ HTML ohne Sanitization
```typescript
// GEFÄHRLICH!
<div dangerouslySetInnerHTML={{ __html: userInput }} />
```

---

## 🚨 Was tun bei Security-Incident?

1. **SOFORT:** Server stoppen falls aktive Attacke
2. Logs checken: Wer, Was, Wann
3. Secrets rotieren (Private Keys, API Keys)
4. Users informieren (falls Daten betroffen)
5. Root Cause Analysis
6. Fixes implementieren
7. Post-Mortem dokumentieren

---

## 📞 Contacts

- **Security Lead:** [TBD]
- **On-Call:** [TBD]
- **Bug Bounty:** [TBD]

---

## 🔗 Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Full Security Audit](./SECURITY-AUDIT.md)
- [Deployment Checklist](./DEPLOYMENT.md)

**Last Updated:** 2025-11-10

