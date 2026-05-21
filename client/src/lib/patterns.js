const PATTERNS = [
  {
    id: 'none',
    label: 'None',
    draw: (ctx) => {
      ctx.clearRect(0, 0, 512, 512)
    },
  },
  {
    id: 'stripes-vertical',
    label: 'Vertical Stripes',
    draw: (ctx) => {
      ctx.clearRect(0, 0, 512, 512)
      ctx.fillStyle = 'rgba(255,255,255,0.18)'
      for (let x = 0; x < 512; x += 40) {
        ctx.fillRect(x, 0, 18, 512)
      }
    },
  },
  {
    id: 'stripes-diagonal',
    label: 'Diagonal Stripes',
    draw: (ctx) => {
      ctx.clearRect(0, 0, 512, 512)
      ctx.save()
      ctx.strokeStyle = 'rgba(255,255,255,0.22)'
      ctx.lineWidth = 14
      for (let i = -512; i < 1024; i += 50) {
        ctx.beginPath()
        ctx.moveTo(i, 0)
        ctx.lineTo(i + 512, 512)
        ctx.stroke()
      }
      ctx.restore()
    },
  },
  {
    id: 'dots',
    label: 'Dots',
    draw: (ctx) => {
      ctx.clearRect(0, 0, 512, 512)
      ctx.fillStyle = 'rgba(255,255,255,0.25)'
      for (let x = 24; x < 512; x += 48) {
        for (let y = 24; y < 512; y += 48) {
          ctx.beginPath()
          ctx.arc(x, y, 8, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    },
  },
  {
    id: 'zigzag',
    label: 'Zigzag',
    draw: (ctx) => {
      ctx.clearRect(0, 0, 512, 512)
      ctx.strokeStyle = 'rgba(255,255,255,0.2)'
      ctx.lineWidth = 6
      const step = 40
      const amp = 20
      for (let row = 0; row < 512 + step; row += step) {
        ctx.beginPath()
        ctx.moveTo(0, row)
        let toggle = 0
        for (let x = 0; x <= 512; x += step / 2) {
          ctx.lineTo(x, row + (toggle % 2 === 0 ? amp : -amp))
          toggle++
        }
        ctx.stroke()
      }
    },
  },
]

export default PATTERNS
