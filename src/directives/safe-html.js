import DOMPurify from 'dompurify'

export default {
  inserted(el, binding) {
    const value = binding.value == null ? '' : String(binding.value)
    el.innerHTML = DOMPurify.sanitize(value)
  },
  update(el, binding) {
    if (binding.value === binding.oldValue) return
    const value = binding.value == null ? '' : String(binding.value)
    el.innerHTML = DOMPurify.sanitize(value)
  },
}

