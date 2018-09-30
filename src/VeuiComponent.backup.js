import {
    Form,
    Field,
    Select,
    Option,
    Button,
    Input,
    Textarea,
    Checkbox,
    Radio,
    RadioGroup,
    Alert
} from 'veui'

const defaultOptions = {
    arrayButtonLabel: 'Add'
}

const VForm = {
    functional: true,
    render(h, {data, props, slots, listeners}) {
        return h(
            Form,
            {
                props: {
                    data: props.value,
                    ...data.attrs,
                    ...props
                },
                on: listeners
            },
            slots().default
        )
    }
}

const VField = {
    functional: true,
    props: {
        label: {type: String},
        enableWrapper: {type: Boolean, default: false}
    },
    render(h, {data, props, slots}) {
        if (data.field.isArrayField && props.enableWrapper !== true) {
            return slots().default
        }
        return h(
            Field,
            {
                props: {
                    field: data.field.attrs.name,
                    label: props.label,
                    ...data.field.attrs
                }
            },
            slots().default
        )
    }
}

const VComponent = component => ({
    functional: true,
    props: ['type', 'label', 'value'],
    render(h, {data, props, slots, listeners}) {
        const vnodes = h(
            component,
            {
                field: data.field,
                props: {
                    ...data.attrs,
                    ...props
                },
                on: {
                    ...listeners,
                    input(value) {
                        const target = vnodes[0].elm
                        target.value = value
                        props.value = value
                        listeners.input({target})
                    },
                    change(value) {
                        const target = vnodes[0].elm
                        target.value = value
                        props.value = value
                        listeners.change({target})
                    }
                }
            },
            slots().default
        )
        return h(
            VField,
            {
                field: data.field,
                props: props,
                on: listeners
            },
            [vnodes]
        )
    }
})

const VCheckbox = () => ({
    functional: true,
    render(h, {data, props, listeners}) {
        const node = h(
            Checkbox,
            {
                props: {
                    name: data.attrs.name,
                    label: data.fieldParent ? props.value : props.label
                },
                on: {
                    change (checked, event) {
                        event.target.checked = checked ? props.value : null
                        listeners.change(event)
                    }
                }
            },
            data.fieldParent && !data.fieldParent.isArrayField ? '' : props.label
        )
        if (data.fieldParent) {
            return h(
                VField,
                {
                    field: data.fieldParent || data.field,
                    props: props
                },
                [node]
            )
        }
        return node
    }
})

const VRadio = {
    functional: true,
    render(h, {data, props, listeners}) {
        return h(
            Radio,
            {
                props: {
                    ...props,
                    name: props.name || data.attrs.name,
                },
                on: listeners
            },
            props.label
        )
    }
}

const VSelect = {
    functional: true,
    render(h, {data, props, listeners, slots}) {
        const field = data.field
        const vnode = h(
            Select,
            {
                props: {
                    ...props,
                    options: field.items
                },
                on: {
                    change: [
                        listeners.change,
                        (value) => {
                            const {label} = field.items.find((item) => item.value === value)
                            vnode.componentInstance.selected.value = value
                            vnode.componentInstance.selected.currentLabel = label
                        }
                    ]
                }
            },
            slots().default
        )
        return vnode
    }
}

const FieldsetCheckbox = {
    functional: true,
    render(h, {data, listeners, slots}) {
        return h(
            VField,
            {
                field: data.field,
                attrs: data.attrs,
                props: {
                    label: data.field.label,
                    enableWrapper: true
                },
                on: listeners
            },
            slots().default
        )
    }
}

const FieldsetRadio = {
    functional: true,
    render(h, {data, props, listeners, slots}) {
        const nodes = slots().default
        const fieldset = h(
            RadioGroup,
            {
                props: props,
                on: listeners
            },
            nodes
        )
        return h(
            VField,
            {
                field: data.field,
                attrs: data.attrs,
                props: {
                    label: props.label,
                    value: props.value,
                    enableWrapper: true
                }
            },
            [fieldset]
        )
    }
}

const FieldsetDefault = {
    functional: true,
    render(h, {data, props, listeners, slots}) {
        const fieldset = h(
            'fieldset',
            {
                props: props,
                on: listeners
            },
            slots().default
        )

        return h(
            VField,
            {
                field: data.field,
                attrs: data.attrs,
                props: {
                    label: data.field.label,
                    enableWrapper: true
                },
                on: listeners
            },
            [fieldset]
        )
    }
}

const FieldsetInput = {
    functional: true,
    render(h, {data, listeners, slots}) {
        const nodes = slots().default || []
        nodes.push(h('div', [
          h(ArrayButton, data.newItemButton)
        ]))

        return h(
            VField,
            {
                field: data.field,
                attrs: data.attrs,
                props: {
                    label: data.field.label,
                    enableWrapper: true
                },
                on: listeners
            },
            nodes
        )
    }
}

const Fieldset = {
    functional: true,
    render(h, {data, props, listeners, slots}) {
        switch (data.field.attrs.type) {
            case 'radio':
                return h(FieldsetRadio, data, slots().default)

            case 'checkbox':
                return h(FieldsetCheckbox, data, slots().default)
        }

        if (data.newItemButton) {
            return h(FieldsetInput, data, slots().default)
        }

        return h(FieldsetDefault, data, slots().default)
    }
}

const ArrayButton = {
    functional: true,
    render(h, {listeners}) {
        return h(
            Button,
            {
                on: listeners,
                attrs: {
                    type: 'text'
                }
            },
            defaultOptions.arrayButtonLabel
        )
    }
}

const Error = {
    functional: true,
    render(h, {slots}) {
        return h(
            Alert,
            {
                props: {
                    type: 'error'
                }
            },
            slots().default
        )
    }
}

export default function (Components, options = {}) {
    let components = new Components()

    components.set('form', VForm)
    components.set('text', VComponent(Input))
    components.set('checkbox', VComponent(VCheckbox))
    components.set('radio', VComponent(VRadio))
    components.set('select', VComponent(VSelect))
    components.set('hidden', 'input')
    components.set('textarea', VComponent(Textarea))
    components.set('fieldset', Fieldset)
    components.set('error', Error)

    defaultOptions.arrayButtonLabel = options.arrayButtonLabel || defaultOptions.arrayButtonLabel

    return components;
}
