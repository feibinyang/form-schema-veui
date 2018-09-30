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
    CheckboxGroup,
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
    render(h, {data, props, slots}) {
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
        if (['text', 'password', 'hidden'].indexOf(data.attrs.type) === -1) {
            props.type = data.attrs.type = 'text';
        }
        const vnode = h(
            component,
            {
                field: data.field,
                data,
                props: {
                    ...data.attrs,
                    ...props
                },
                on: {
                    ...listeners,
                    input(value, event = {target: vnode.elm}) {
                        event.target.value = value
                        props.value = value
                        listeners.input(event)
                    },
                    change(value, event = {target: vnode.elm}) {
                        event.target.value = value
                        props.value = value
                        listeners.change(event)
                    }
                }
            },
            slots().default
        )
        if (data.field.isArrayField) {
            return vnode
        }
        return h(
            VField,
            {
                field: data.field,
                props: props,
                on: listeners
            },
            [vnode]
        )
    }
})

const VCheckbox = {
    functional: true,
    render(h, {data, props, listeners}) {
        const vnode = h(
            Checkbox,
            {
                props: {
                    ...props,
                    ...data.attrs
                },
                on: {
                    change (checked, event = {target: vnode.elm}) {
                        event.target.checked = checked ? props.value : null
                        listeners.change(event)
                    },
                    input(value, event = {target: vnode.elm}) {
                        event.target.value = value
                        listeners.input(event)
                    }
                }
            }
        )

        return h(
            VField,
            {
                field: data.field || data.fieldParent,
                props: props,
                on: listeners
            },
            [vnode]
        )
    }
}

const VRadio = {
    functional: true,
    render(h, {data, props, listeners}) {
        const vnode = h(
            Radio,
            {
                props: {
                    ...props,
                    ...data.attrs
                },
                on: {
                    change (checked, event = {target: vnode.elm}) {
                        event.target.checked = checked ? props.value : null
                        listeners.change(event)
                    },
                    input(value, event = {target: vnode.elm}) {
                        event.target.value = value
                        listeners.input(event)
                    }
                }
            }
        )

        return h(
            VField,
            {
                field: data.field || data.fieldParent,
                data,
                props,
                on: listeners
            },
            [vnode]
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
                    ...data.attrs,
                    options: field.items
                },
                on: {
                    change(value, event = {target: vnode.elm}) {
                        event.target.value = value
                        listeners.change(event)
                    }
                }
            }
        )
        return h(
            VField,
            {
                field: data.field || data.fieldParent,
                props: props,
                on: listeners
            },
            [vnode]
        )
    }
}

const FieldsetCheckbox = {
    functional: true,
    render(h, {data, props, listeners, slots}) {
        const vnode = h(
            CheckboxGroup,
            {
                props: {
                    ...props,
                    items: data.field.items
                },
                on: {
                    change(value, event = {target: vnode.elm}) {
                        event.target.value = value
                        listeners.change(event)
                    }
                }
            }
        )
        return h(
            VField,
            {
                field: data.field || data.fieldParent,
                props: props,
                on: listeners
            },
            [vnode]
        )
    }
}

const FieldsetRadio = {
    functional: true,
    render(h, {data, props, listeners, slots}) {
        const vnode = h(
            RadioGroup,
            {
                props: {
                    ...props,
                    items: data.field.items
                },
                on: {
                    change(value, event = {target: vnode.elm}) {
                        event.target.value = value
                        listeners.change(event)
                    }
                }
            }
        )
        return h(
            VField,
            {
                field: data.field || data.fieldParent,
                props: props,
                on: listeners
            },
            [vnode]
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
                field: data.field || data.fieldParent,
                props: props,
                on: listeners
            },
            [fieldset]
        )
    }
}

const FieldsetInput = {
    functional: true,
    render(h, {data, props, listeners, slots}) {
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
                    ...props
                },
                on: listeners
            },
            [nodes]
        )
    }
}

const VFieldset = {
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
                    type: 'button',
                    ui: 'primary'
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
    components.set('hidden', VComponent(Input))
    components.set('email', VComponent(Input))
    components.set('textarea', VComponent(Textarea))
    components.set('checkbox', VCheckbox)
    components.set('radio', VRadio)
    components.set('select', VSelect)
    components.set('fieldset', VFieldset)
    components.set('error', Error)

    if (options.arrayButtonLabel) {
        defaultOptions.arrayButtonLabel = options.arrayButtonLabel
    }

    return components;
}
