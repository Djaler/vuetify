// Types
import Vue, { VNode, PropType } from 'vue'
import { DataTableHeader } from 'vuetify/types'

// Utils
import { getObjectValueByPath } from '../../util/helpers'

export default Vue.extend({
  name: 'row',

  functional: true,

  props: {
    headers: Array as PropType<DataTableHeader[]>,
    index: Number,
    item: Object,
    rtl: Boolean,
  },

  render (h, { props, slots, data }): VNode {
    const computedSlots = slots()

    const columns: VNode[] = props.headers.map((header: DataTableHeader) => {
      const children = []
      const value = getObjectValueByPath(props.item, header.value)

      const slotName = header.value
      const scopedSlot = data.scopedSlots && data.scopedSlots[slotName]
      const regularSlot = computedSlots[slotName]

      if (scopedSlot) {
        children.push(scopedSlot({
          item: props.item,
          isMobile: false,
          header,
          index: props.index,
          value,
        }))
      } else if (regularSlot) {
        children.push(regularSlot)
      } else {
        children.push(value == null ? value : String(value))
      }

      const textAlign = `text-${header.align || 'start'}`

      return h('td', {
        class: [
          textAlign,
          header.cellClass,
          {
            'v-data-table__divider': header.divider,
          },
        ],
      }, children)
    })

    return h('tr', data, columns)
  },
})
