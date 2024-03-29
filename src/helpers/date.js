var moment = require('moment')

class DateHandling {
  constructor(start, end, format, tz) {
    this.valid = true
    this.format = format || 'YYYY-MM-DD HH:mm:ss'
    this.start = start || moment().format(this.format)
    this.end = end || moment().format(this.format)
    this.tz = tz || ''
    this.fullSecondsEnd = 0
    this.daysEnd = 0
    this.hoursEnd = 0
    this.minutesEnd = 0
    this.secondsEnd = 0

    this.fullSecondsStart = 0
    this.daysStart = 0
    this.hoursStart = 0
    this.minutesStart = 0
    this.secondsStart = 0

    this.endTime = {
      fullSeconds: this.fullSecondsEnd,
      days: addZero(this.daysEnd),
      hours: addZero(this.hoursEnd),
      minutes: addZero(this.minutesEnd),
      seconds: addZero(this.secondsEnd),
    }
    this.startTime = {
      fullSeconds: this.fullSecondsStart,
      days: addZero(this.daysStart),
      hours: addZero(this.hoursStart),
      minutes: addZero(this.minutesStart),
      seconds: addZero(this.secondsStart),
    }

    this.current = tz ? moment().tz(tz).format(this.format) : moment().format(this.format)

    if (!moment(this.start, this.format).isValid()) {
      console.warn('The start date does not match the current format.')
      this.valid = false
    } else {
      this.fullSecondsStart = countStartFullSeconds(this.current, this.start, this.format)

      this.daysStart = countStartDays(this.fullSecondsStart)
      this.hoursStart = countStartHours(this.fullSecondsStart, this.daysStart)
      this.minutesStart = countStartMinutes(this.fullSecondsStart, this.daysStart, this.hoursStart)
      this.secondsStart = countStartSeconds(
        this.fullSecondsStart,
        this.daysStart,
        this.hoursStart,
        this.minutesStart
      )

      recalculate(this)
    }
    if (!moment(this.end, this.format).isValid()) {
      console.warn('The end date does not match the current format.')
      this.valid = false
    } else {
      this.fullSecondsEnd = countEndFullSeconds(this.current, this.end, this.format)
      this.daysEnd = countEndDays(this.fullSecondsEnd)
      this.hoursEnd = countEndHours(this.fullSecondsEnd, this.daysEnd)
      this.minutesEnd = countEndMinutes(this.fullSecondsEnd, this.daysEnd, this.hoursEnd)
      this.secondsEnd = countEndSeconds(
        this.fullSecondsEnd,
        this.daysEnd,
        this.hoursEnd,
        this.minutesEnd
      )
      recalculate(this)
    }
  }

  setStart(start) {
    if (!moment(start, this.format).isValid()) {
      console.warn('The start date does not match the current format.')
      this.valid = false
    } else {
      this.fullSecondsStart = countStartFullSeconds(this.current, this.start, this.format)

      this.daysStart = countStartDays(this.fullSecondsStart)
      this.hoursStart = countStartHours(this.fullSecondsStart, this.daysStart)
      this.minutesStart = countStartMinutes(this.fullSecondsStart, this.daysStart, this.hoursStart)
      this.secondsStart = countStartSeconds(
        this.fullSecondsStart,
        this.daysStart,
        this.hoursStart,
        this.minutesStart
      )
      this.start = start
      recalculate(this)
    }
  }
  setEnd(end) {
    if (!moment(end, this.format).isValid()) {
      console.warn('The end date does not match the current format.')
      this.valid = false
    } else {
      this.end = end
      this.fullSecondsEnd = countEndFullSeconds(this.current, this.end, this.format)
      this.daysEnd = countEndDays(this.fullSecondsEnd)
      this.hoursEnd = countEndHours(this.fullSecondsEnd, this.daysEnd)
      this.minutesEnd = countEndMinutes(this.fullSecondsEnd, this.daysEnd, this.hoursEnd)
      this.secondsEnd = countEndSeconds(
        this.fullSecondsEnd,
        this.daysEnd,
        this.hoursEnd,
        this.minutesEnd
      )
      recalculate(this)
    }
  }
  setFormat(format) {
    this.format = format
    if (!moment(this.end, format).isValid()) {
      console.warn('The end date does not match the current format.')
      this.valid = false
    } else {
      this.fullSecondsEnd = countEndFullSeconds(this.current, this.end, this.format)
      this.daysEnd = countEndDays(this.fullSecondsEnd)
      this.hoursEnd = countEndHours(this.fullSecondsEnd, this.daysEnd)
      this.minutesEnd = countEndMinutes(this.fullSecondsEnd, this.daysEnd, this.hoursEnd)
      this.secondsEnd = countEndSeconds(
        this.fullSecondsEnd,
        this.daysEnd,
        this.hoursEnd,
        this.minutesEnd
      )

      this.fullSecondsStart = countStartFullSeconds(this.current, this.start, this.format)
      this.daysStart = countStartDays(this.fullSecondsStart)
      this.hoursStart = countStartHours(this.fullSecondsStart, this.daysStart)
      this.minutesStart = countStartMinutes(this.fullSecondsStart, this.daysStart, this.hoursStart)
      this.secondsStart = countStartSeconds(
        this.fullSecondsStart,
        this.daysStart,
        this.hoursStart,
        this.minutesStart
      )
      recalculate(this)
    }
    if (!moment(this.start, format).isValid()) {
      console.warn('The start date does not match the current format.')
      this.valid = false
    } else {
      this.fullSecondsStart = countStartFullSeconds(this.current, this.start, this.format)
      this.daysStart = countStartDays(this.fullSecondsStart)
      this.hoursStart = countStartHours(this.fullSecondsStart, this.daysStart)
      this.minutesStart = countStartMinutes(this.fullSecondsStart, this.daysStart, this.hoursStart)
      this.secondsStart = countStartSeconds(
        this.fullSecondsStart,
        this.daysStart,
        this.hoursStart,
        this.minutesStart
      )
      recalculate(this)
    }
  }
  setTz(tz) {
    if (!tz) {
      console.warn('Time zone not set.')
      this.valid = false
    } else {
      this.tz = tz
      this.current = moment().tz(tz).format(this.format)
      this.fullSecondsEnd = countEndFullSeconds(this.current, this.end, this.format)
      this.daysEnd = countEndDays(this.fullSecondsEnd)
      this.hoursEnd = countEndHours(this.fullSecondsEnd, this.daysEnd)
      this.minutesEnd = countEndMinutes(this.fullSecondsEnd, this.daysEnd, this.hoursEnd)
      this.secondsEnd = countEndSeconds(
        this.fullSecondsEnd,
        this.daysEnd,
        this.hoursEnd,
        this.minutesEnd
      )

      this.fullSecondsStart = countStartFullSeconds(this.current, this.start, this.format)
      this.daysStart = countStartDays(this.fullSecondsStart)
      this.hoursStart = countStartHours(this.fullSecondsStart, this.daysStart)
      this.minutesStart = countStartMinutes(this.fullSecondsStart, this.daysStart, this.hoursStart)
      this.secondsStart = countStartSeconds(
        this.fullSecondsStart,
        this.daysStart,
        this.hoursStart,
        this.minutesStart
      )

      recalculate(this)
    }
  }
  getSart() {
    return this.start
  }
  getEnd() {
    return this.end
  }
  getFormat() {
    return this.format
  }
  getTz() {
    if (this.tz) {
      return this.tz
    } else {
      console.log('Time zone not set.')
      return
    }
  }
  getCurrent() {
    return this.current
  }

  getfullSecondsEnd() {
    return this.fullSecondsEnd
  }
  getEndDays(number) {
    return number ? this.daysEnd : addZero(this.daysEnd)
  }
  getEndHours(number) {
    return number ? this.hoursEnd : addZero(this.hoursEnd)
  }
  getEndMinutes(number) {
    return number ? this.minutesEnd : addZero(this.minutesEnd)
  }
  getEndSeconds(number) {
    return number ? this.secondsEnd : addZero(this.secondsEnd)
  }

  getfullSecondsStart() {
    return this.fullSecondsStart
  }
  getStartDays(number) {
    return number ? this.daysStart : addZero(this.daysStart)
  }
  getStartHours(number) {
    return number ? this.hoursStart : addZero(this.hoursStart)
  }
  getStartMinutes(number) {
    return number ? this.minutesStart : addZero(this.minutesStart)
  }
  getSecondSeconds(number) {
    return number ? this.secondsStart : addZero(this.secondsStart)
  }
}

const recalculate = (self) => {
  self.endTime = {
    fullSeconds: self.fullSecondsEnd,
    days: addZero(self.daysEnd),
    hours: addZero(self.hoursEnd),
    minutes: addZero(self.minutesEnd),
    seconds: addZero(self.secondsEnd),
  }
  self.startTime = {
    fullSeconds: self.fullSecondsStart,
    days: addZero(self.daysStart),
    hours: addZero(self.hoursStart),
    minutes: addZero(self.minutesStart),
    seconds: addZero(self.secondsStart),
  }
}

const countEndFullSeconds = (current, end, format) => {
  const endUnix = moment(end, format).utc()
  const currentUnix = moment(current, format).utc()
  const result = (endUnix - currentUnix) / 1000
  return result
}
const countEndDays = (fullSecondsEnd) => {
  let item = Math.trunc(fullSecondsEnd / (60 * 60 * 24))
  return item
}
const countEndHours = (fullSecondsEnd, daysEnd) => {
  return Math.trunc((fullSecondsEnd - daysEnd * 24 * 60 * 60) / (60 * 60))
}
const countEndMinutes = (fullSecondsEnd, daysEnd, hoursEnd) => {
  return Math.trunc((fullSecondsEnd - (daysEnd * 24 * 60 * 60 + hoursEnd * 60 * 60)) / 60)
}
const countEndSeconds = (fullSecondsEnd, daysEnd, hoursEnd, minutesEnd) => {
  return Math.trunc(
    fullSecondsEnd - (daysEnd * 24 * 60 * 60 + hoursEnd * 60 * 60 + minutesEnd * 60)
  )
}

const countStartFullSeconds = (current, start, format) => {
  const startUnix = moment(start, format).utc()
  const currentUnix = moment(current, format).utc()
  const result = (startUnix - currentUnix) / 1000
  return result
}
const countStartDays = (fullSecondsStart) => {
  let item = Math.trunc(fullSecondsStart / (60 * 60 * 24))
  return item
}
const countStartHours = (fullSecondsStart, daysStart) => {
  return Math.trunc((fullSecondsStart - daysStart * 24 * 60 * 60) / (60 * 60))
}
const countStartMinutes = (fullSecondsStart, daysStart, hoursStart) => {
  return Math.trunc((fullSecondsStart - (daysStart * 24 * 60 * 60 + hoursStart * 60 * 60)) / 60)
}
const countStartSeconds = (fullSecondsStart, daysStart, hoursStart, minutesStart) => {
  return Math.trunc(
    fullSecondsStart - (daysStart * 24 * 60 * 60 + hoursStart * 60 * 60 + minutesStart * 60)
  )
}

const addZero = (val) => {
  let item = '00'
  const numberlength = String(val).length

  if (+val > 0 && numberlength < 2) {
    item = `0${String(val)}`
  } else if (+val > 0 && numberlength > 1) {
    item = String(val)
  } else if (+val < 0 && numberlength < 3) {
    item = `0${Math.abs(val)}`
  } else if (val === 0) {
    item = '00'
  } else if (+val < 10) {
    item = String(Math.abs(val))
  }

  return item
}

export { DateHandling }
