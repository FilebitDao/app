const openUrl = (url: string) => {
  const a = document.createElement('a')
  a.target = '_blank'
  a.style.cssText = 'display: none;'
  a.href = url

  document.body.appendChild(a)
  a.click()

  setTimeout(() => {
    document.body.removeChild(a)
  }, 100)
}

export default openUrl
