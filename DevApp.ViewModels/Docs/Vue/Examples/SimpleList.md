##### SimpleList.vue

```html
<template>
  <div>
    <header>
      <input type="text" class="form-control" placeholder="First name" v-model="firstName">
      <input type="text" class="form-control" placeholder="Last name" v-model="lastName">
      <button type="button" class="btn btn-primary" @click="add">Add</button>
    </header>
    <table>
      <thead>
        <tr>
          <th>First Name</th>
          <th>Last Name</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="employee in Employees" :key="employee.Id">
          <td>
            <InlineEdit
              :value="employee.FirstName"
              @update="onUpdate(employee, 'FirstName', $event)"
            />
          </td>
          <td>
            <InlineEdit
              :value="employee.LastName"
              @update="onUpdate(employee, 'LastName', $event)"
            />
          </td>
          <td>
            <div @click="onRemove(employee.Id)">
              <i class="material-icons">clear</i>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import dotnetify from 'dotnetify/vue';
import InlineEdit from './InlineEdit.vue';

export default {
  name: 'SimpleList',
  components: {
    'InlineEdit': InlineEdit
  },
  created() {
    this.vm = dotnetify.vue.connect("SimpleListVM", this);
    this.dispatch = state => this.vm.$dispatch(state);
  },
  destroyed() {
    this.vm.$destroy();
  },
  data() {
    return {
      firstName: '',
      lastName: '',
      Employees: []
    }
  },
  methods: {
    add: function () {
      let fullName = `${this.firstName} ${this.lastName}`;
      if (fullName.trim() !== '') {
        this.dispatch({ Add: fullName });
        this.firstName = '';
        this.lastName = '';
      }
    },
    onUpdate(employee, prop, value) {
      employee[prop] = value;
      this.dispatch({ Update: { Id: employee.Id, [prop]: value } });
    },
    onRemove(id) {
      this.dispatch({ Remove: id });
    }
  }
}
</script>
```

##### InlineEdit.vue

```html
<template>
  <div>
    <span v-if="!edit" class="editable" @click="toggleEdit">{{value}}</span>
    <input
      v-else
      type="text"
      class="form-control"
      ref="inputElem"
      v-model.lazy="input"
      @blur="update"
      @keydown.enter="update"
    >
  </div>
</template>

<script>
export default {
  name: 'InlineEdit',
  props: ['value'],
  data() {
    return {
      edit: false,
      input: this.value
    }
  },
  methods: {
    toggleEdit() {
      this.edit = !this.edit;
      if (this.edit)
        setTimeout(_ => this.$refs.inputElem.focus());
    },
    update: function () {
      this.toggleEdit();
      this.$emit('update', this.input);
    },
    watch: {
      value: function (newVal, oldVal) {
        this.input = newVal;
      }
    }
  }
}
</script>
```