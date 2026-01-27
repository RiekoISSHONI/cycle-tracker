/**
 * Generate iCalendar (.ics) file content for cycle events
 * Compatible with Apple Calendar, Google Calendar, Outlook, etc.
 */

/**
 * Format date to iCalendar format (YYYYMMDD)
 */
function formatICSDate(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

/**
 * Generate a unique ID for calendar events
 */
function generateUID() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}@flo-cycle-tracker`;
}

/**
 * Get current timestamp in iCalendar format
 */
function getTimestamp() {
  const now = new Date();
  return now.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

/**
 * Calculate future cycle events
 * @param {string} lastPeriodStart - ISO date string of last period
 * @param {number} cycleLength - Cycle length in days
 * @param {number} monthsAhead - How many months to generate events for
 * @returns {Array} Array of event objects
 */
function calculateCycleEvents(lastPeriodStart, cycleLength, monthsAhead = 6) {
  const events = [];
  const startDate = new Date(lastPeriodStart);
  const today = new Date();

  // Calculate how many cycles to generate
  const daysAhead = monthsAhead * 30;
  const cyclesToGenerate = Math.ceil(daysAhead / cycleLength) + 1;

  // Find the first cycle that starts on or after today
  const daysSinceStart = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
  const currentCycleNumber = Math.floor(daysSinceStart / cycleLength);

  for (let i = 0; i <= cyclesToGenerate; i++) {
    const cycleNumber = currentCycleNumber + i;
    const cycleStart = new Date(startDate);
    cycleStart.setDate(cycleStart.getDate() + (cycleNumber * cycleLength));

    // Skip if this cycle already passed
    if (cycleStart < today && i === 0) {
      // For current cycle, still add if we're in the middle of it
      const cycleEnd = new Date(cycleStart);
      cycleEnd.setDate(cycleEnd.getDate() + cycleLength);
      if (cycleEnd < today) continue;
    }

    // Period event (5 days)
    const periodEnd = new Date(cycleStart);
    periodEnd.setDate(periodEnd.getDate() + 5);

    events.push({
      type: 'period',
      title: 'Period',
      description: 'Menstrual phase - Focus on rest, iron-rich foods, and gentle movement.',
      startDate: cycleStart,
      endDate: periodEnd,
      color: 'red'
    });

    // Ovulation event (around day 14)
    const ovulationDay = Math.round(cycleLength / 2);
    const ovulationStart = new Date(cycleStart);
    ovulationStart.setDate(ovulationStart.getDate() + ovulationDay - 1);
    const ovulationEnd = new Date(ovulationStart);
    ovulationEnd.setDate(ovulationEnd.getDate() + 1);

    events.push({
      type: 'ovulation',
      title: 'Ovulation Day',
      description: 'Peak energy and fertility. Great day for important meetings and workouts.',
      startDate: ovulationStart,
      endDate: ovulationEnd,
      color: 'orange'
    });

    // Fertile window (5 days before ovulation + ovulation day)
    const fertileStart = new Date(ovulationStart);
    fertileStart.setDate(fertileStart.getDate() - 5);

    events.push({
      type: 'fertile',
      title: 'Fertile Window Starts',
      description: 'Higher chance of conception during this window.',
      startDate: fertileStart,
      endDate: new Date(fertileStart.getTime() + 24 * 60 * 60 * 1000),
      color: 'green'
    });

    // PMS reminder (5 days before period)
    const pmsStart = new Date(cycleStart);
    pmsStart.setDate(pmsStart.getDate() + cycleLength - 5);

    events.push({
      type: 'pms',
      title: 'Luteal Phase - Self-Care Time',
      description: 'Wind down phase. Reduce fasting, prioritize sleep, and be gentle with yourself.',
      startDate: pmsStart,
      endDate: new Date(pmsStart.getTime() + 24 * 60 * 60 * 1000),
      color: 'purple'
    });
  }

  // Filter out past events and sort by date
  return events
    .filter(e => e.startDate >= today || e.endDate >= today)
    .sort((a, b) => a.startDate - b.startDate);
}

/**
 * Generate iCalendar file content
 * @param {Array} events - Array of event objects
 * @returns {string} iCalendar file content
 */
function generateICSContent(events) {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Flo Cycle Tracker//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:My Cycle',
    'X-WR-TIMEZONE:UTC'
  ];

  for (const event of events) {
    const startDate = formatICSDate(event.startDate);
    const endDate = formatICSDate(event.endDate);

    lines.push('BEGIN:VEVENT');
    lines.push(`UID:${generateUID()}`);
    lines.push(`DTSTAMP:${getTimestamp()}`);
    lines.push(`DTSTART;VALUE=DATE:${startDate}`);
    lines.push(`DTEND;VALUE=DATE:${endDate}`);
    lines.push(`SUMMARY:${event.title}`);
    lines.push(`DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`);

    // Add reminder 1 day before for period and PMS events
    if (event.type === 'period' || event.type === 'pms') {
      lines.push('BEGIN:VALARM');
      lines.push('TRIGGER:-P1D');
      lines.push('ACTION:DISPLAY');
      lines.push(`DESCRIPTION:${event.title} starts tomorrow`);
      lines.push('END:VALARM');
    }

    lines.push('END:VEVENT');
  }

  lines.push('END:VCALENDAR');

  return lines.join('\r\n');
}

/**
 * Download iCalendar file
 * @param {string} lastPeriodStart - ISO date string
 * @param {number} cycleLength - Cycle length in days
 * @param {number} monthsAhead - Months to generate (default 6)
 */
export function downloadCalendarEvents(lastPeriodStart, cycleLength, monthsAhead = 6) {
  const events = calculateCycleEvents(lastPeriodStart, cycleLength, monthsAhead);
  const icsContent = generateICSContent(events);

  // Create and download file
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'my-cycle.ics';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);

  return events.length;
}

/**
 * Generate calendar subscription URL (for future server implementation)
 * For now, we'll use the download approach
 */
export function getCalendarEvents(lastPeriodStart, cycleLength, monthsAhead = 6) {
  return calculateCycleEvents(lastPeriodStart, cycleLength, monthsAhead);
}
