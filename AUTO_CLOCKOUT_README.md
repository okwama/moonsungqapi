# Auto Clockout Feature

## Overview
This feature automatically clocks out all active users every day at 10 PM (22:00) but records the clock-out time as 8 PM (20:00) in the database.

## How It Works

### Schedule
- **Runs**: Every day at 10:00 PM (22:00)
- **Timezone**: Africa/Nairobi
- **Cron Expression**: `0 22 * * *`

### Process
1. **Detection**: Finds all active sessions (status = 1) for the current day
2. **Calculation**: Calculates duration from session start to 8 PM
3. **Update**: Updates each session with:
   - Status: 2 (Ended)
   - Session End: 8 PM (20:00)
   - Duration: Calculated minutes from start to 8 PM

### Database Changes
- Updates `login_history` table
- Sets `status` to 2 (ended)
- Sets `sessionEnd` to 8 PM timestamp
- Calculates and sets `duration` in minutes

## API Endpoints

### 1. Get Configuration
```
GET /auto-clockout/config
```
Returns the auto clockout configuration and schedule.

### 2. Get Statistics
```
GET /auto-clockout/stats
```
Returns current statistics including:
- Number of active sessions
- Next auto clockout time
- Recorded time (8 PM)
- Timezone

### 3. Manual Trigger (Testing)
```
POST /auto-clockout/trigger
```
Manually triggers the auto clockout process for testing purposes.

## Testing

### Run Test Script
```bash
node test-auto-clockout.js
```

### Manual Testing
1. Start the server: `npm run start:dev`
2. Test configuration: `curl http://localhost:3000/auto-clockout/config`
3. Test statistics: `curl http://localhost:3000/auto-clockout/stats`
4. Test manual trigger: `curl -X POST http://localhost:3000/auto-clockout/trigger`

## Logs
The service logs all activities:
- 🕙 Starting auto clockout process
- 📊 Number of active sessions found
- ✅ Successfully clocked out users
- ❌ Failed clockouts
- 🎯 Completion summary

## Configuration

### Environment Variables
No additional environment variables required. The service uses:
- Database connection from existing config
- Timezone: Africa/Nairobi (hardcoded)
- Schedule: 10 PM daily (hardcoded)

### Customization
To modify the schedule or recorded time, edit:
- `auto-clockout.service.ts` - Main logic
- `auto-clockout.controller.ts` - API endpoints

## Monitoring

### Check Active Sessions
```sql
SELECT COUNT(*) as active_sessions 
FROM login_history 
WHERE DATE(sessionStart) = CURDATE() 
AND status = 1;
```

### Check Auto Clockout Results
```sql
SELECT userId, sessionStart, sessionEnd, duration, status
FROM login_history 
WHERE DATE(sessionStart) = CURDATE() 
AND sessionEnd LIKE '%20:00%';
```

## Troubleshooting

### Common Issues
1. **Service not running**: Check if `@nestjs/schedule` is properly imported
2. **Wrong timezone**: Verify server timezone is set to Africa/Nairobi
3. **Database errors**: Check database connection and permissions
4. **No active sessions**: Verify users are actually clocked in

### Debug Commands
```bash
# Check server logs
npm run start:dev

# Test manual trigger
curl -X POST http://localhost:3000/auto-clockout/trigger

# Check configuration
curl http://localhost:3000/auto-clockout/config
```

## Security Notes
- Manual trigger endpoint is not protected (for testing)
- Consider adding authentication for production
- Logs contain sensitive user information
- Database updates are irreversible

## Future Enhancements
- Add authentication to manual trigger
- Add notification system for auto clockouts
- Add configuration via environment variables
- Add audit trail for auto clockouts
- Add exception handling for specific users
