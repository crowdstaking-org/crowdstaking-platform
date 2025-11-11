# DigitalOcean: Pexels API Key Setup

## Environment Variable hinzufügen

Da der automatische Update fehlschlägt (GitHub Auth), bitte manuell hinzufügen:

### Schritt-für-Schritt Anleitung:

1. **DigitalOcean App Platform öffnen:**
   - https://cloud.digitalocean.com/apps

2. **CrowdStaking App auswählen:**
   - App: `crowdstaking-platform`
   - URL: https://crowdstaking.org

3. **Settings → Environment Variables:**
   - Click "Edit" (rechts oben)

4. **Neue Variable hinzufügen:**
   ```
   Key:   PEXELS_API_KEY
   Value: 5G9hHYA56i8tZCo6lJFfGrlzYzY70uPODoOUmkSfIChtY3vDkmEgScAN
   Scope: RUN_AND_BUILD_TIME
   Type:  PLAINTEXT (nicht SECRET, da nur API Key)
   ```

5. **Save** klicken

6. **Deployment triggern** (optional):
   - Die neue Variable ist sofort verfügbar
   - Kein Rebuild nötig (Bilder sind bereits im Repo)
   - Nur relevant wenn du das Script auf Production laufen lassen willst

## Warum wird der Key benötigt?

Der Pexels API Key wird vom Script `scripts/generate-blog-images.ts` verwendet um:
- Automatisch neue Blog-Bilder zu generieren
- Fallback wenn keine passenden Bilder gefunden werden
- Potentiell in Zukunft: Automatische Bilder für neue Blog-Posts

## Aktueller Status

✅ **Lokal:** API Key bereits in `.env.local` (funktioniert)  
✅ **Bilder:** Alle 19 Artikel haben echte Pexels-Bilder  
✅ **Git:** Bilder committed und gepusht  
⏳ **DigitalOcean:** Muss manuell hinzugefügt werden  

## Alternative: Script lokal laufen lassen

Da die Bilder im Git Repo sind und deployed werden, ist der API Key auf Production optional. Du kannst:
- Script nur lokal ausführen (wie gerade geschehen)
- Bilder committen
- Production deployed automatisch die Bilder

Für neue Artikel in Zukunft:
1. Lokal erstellen
2. Script lokal ausführen
3. Bilder committen
4. Push → Auto-Deploy

**Der API Key auf Production ist nice-to-have, aber nicht zwingend erforderlich.**

