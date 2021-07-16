const capitalize = data => {
   return data && data[0].toUpperCase() + data.slice(1)
}
const delayMethod = (method, delay) => {
   let timer
   return function() {
      let context = this,
         args = arguments
      clearTimeout(timer)
      timer = setTimeout(() => {
         method.apply(context, args)
      }, delay)
   }
}
const EmptyObject = obj => {
   return Object.keys(obj).length === 0 && obj.constructor === Object
}

const TypeConversion = id => {
   switch (id) {
      case '8':
         return 'Date'
      case '9':
         return 'Time'
      case '4':
         return 'Integer'
      case '10':
         return 'String'
      case '6':
         return 'Float'
      case '16':
         return 'Character'
      case '1':
         return 'Boolean'
      default:
         return 'NA'
   }
}

export { capitalize, delayMethod, EmptyObject, TypeConversion }
