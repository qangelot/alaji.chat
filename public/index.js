let pseudo = null
let avatar = '/images/avatars/1.svg'

document.querySelectorAll('[data-avatar]').forEach(function (element) {
  element.addEventListener('click', function (e) {
    e.preventDefault()
    document.querySelector('[data-avatar].active').classList.remove('active')
    this.classList.add('active')
    avatar = `/images/avatars/${this.getAttribute('data-avatar')}.svg`
  })
})

document.querySelector('.init form').addEventListener('submit', function (e) {
  e.preventDefault()
  const value = this.querySelector('input').value
  if (value.length) {
    pseudo = value
    document.querySelector('.init').remove()
    window.location = `./chat.html?pseudo=${pseudo}&avatar=${avatar}`
    connect()
  }
})
