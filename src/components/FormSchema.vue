<template>
  <FormSchema :schema="schema" v-model="model"
  :components="components" ref="formSchema">
    <div class="operation">
      <veui-button ui="primary" type="submit" @click="submit">确定</veui-button>
      <veui-button @click="cancel">取消</veui-button>
    </div>
  </FormSchema>
</template>

<script>
  import FormSchema, {Components} from '@formschema/native'
  import schema from '../assets/schema/demo.json'
  import VeuiComponents from "../VeuiComponents";
  import {Button} from 'veui';

  export default {
    data: () => ({
      schema: schema,
      model: {},
      components: VeuiComponents(Components)
    }),
    methods: {
      submit(e) {
        console.log(JSON.stringify(this.model));
        this.$emit('submit', e);
        e.preventDefault();
      },
      cancel(e) {
        this.$emit('cancel', e);
      }
    },
    components: {
      FormSchema,
      'veui-button': Button
    }
  }
</script>
