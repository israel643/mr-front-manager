<script setup>
import { reactive, ref, watch, computed } from 'vue';
import useVuelidate from '@vuelidate/core';

import { User } from '@/models/User';
import { userRules } from '@/validators/userRules';
import { passwordRules } from '@/validators/passwordRules';
import { getValidationError } from '@/composables/useValidationMessages';

import BaseCloseModalButton from '@/components/BaseCloseModalButton.vue';
import BaseInput from '@/components/BaseInput.vue';
import BaseInputPassword from '@/components/BaseInputPassword.vue';
import BaseSelect from '@/components/BaseSelect.vue';
import BaseFormContainerActions from '@/components/BaseFormContainerActions.vue';

const props = defineProps(['open', 'isEditing', 'initialUser']);
const emit = defineEmits(['save', 'close']);

const baseUser = new User();
const confirmPassword = ref('');
const user = reactive({ ...baseUser, confirmPassword });
const imageFile = ref(null);
const userRoles = [{ id: 1, name: 'Administrador' }, { id: 2, name: 'Almacenista' }];

watch(() => props.initialUser, (newVal) => {
  Object.assign(user, newVal || baseUser);
  confirmPassword.value = '';
}, { immediate: true });

const rules = computed(() => ({
  ...userRules,
  ...(props.isEditing ? {} : passwordRules(user.password))
}));
const $v = useVuelidate(rules, user);
const isFormValid = computed(() => !$v.value.$invalid);

const nameError = computed(() =>
  getValidationError($v.value.name, {
    required: 'Campo obligatorio'
  })
);

const lastnameError = computed(() =>
  getValidationError($v.value.lastName, {
    required: 'Campo obligatorio'
  })
);

const emailError = computed(() =>
  getValidationError($v.value.email, {
    required: 'Campo obligatorio',
    email: 'Debe ser un correo electrónico válido'
  })
);

const passwordError = computed(() =>
  getValidationError($v.value.password, {
    required: 'Campo obligatorio',
    strongPassword: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial',
  })
);

const confirmError = computed(() =>
  getValidationError($v.value.confirmPassword, {
    required: 'Campo obligatorio',
    sameAsPassword: 'Las contraseñas no coinciden'
  })
);

const rolError = computed(() =>
  getValidationError($v.value.roleId, {
    required: 'Campo obligatorio'
  })
);

const handleImage = (e) => {
  imageFile.value = e.target.files[0]
}

function closeForm() {
  $v.value.$reset();
  confirmPassword.value = '';
  emit('close')
}

function saveData() {
  $v.value.$touch();
  if (!$v.value.$invalid) {
    const formData = new FormData();
    if (user.id) formData.append('id', user.id);
    formData.append('name', user.name);
    formData.append('lastName', user.lastName);
    formData.append('email', user.email);
    formData.append('password', user.password);
    formData.append('roleId', user.roleId);
    formData.append('active', user.active);
    if (imageFile.value) formData.append('image', imageFile.value)
    emit('save', { formData });
    $v.value.$reset();
  }
}
</script>

<template>
  <dialog class="modal" :open="open">
    <div class="modal-box max-w-2xl">
      <h2 class="text-2xl font-bold mb-4">
        {{ `${isEditing ? 'Editar' : 'Agregar'} usuario` }}
      </h2>
      <BaseCloseModalButton @close="closeForm" />

      <!-- Oculto (Id, Status) -->
      <input type="hidden" v-model="user.id" />
      <input type="hidden" v-model="user.active" />

      <div class="flex w-full">
        <!-- Nombre -->
        <div class="px-2 w-6/12">
          <BaseInput v-model="user.name" label="Nombre" placeholder="Nombre" :error="nameError"
            @blur="$v.name.$touch()" />
        </div>

        <!-- Apellido -->
        <div class="px-2 w-6/12">
          <BaseInput v-model="user.lastName" label="Apellido" placeholder="Apellido" :error="lastnameError"
            @blur="$v.lastName.$touch()" />
        </div>
      </div>

      <!-- Correo -->
      <BaseInput v-model="user.email" :type="'email'" label="Correo electrónico" placeholder="Correo"
        :error="emailError" @blur="$v.email.$touch()" />

      <!-- Contraseña -->
      <div class="w-full flex flex-col sm:flex-row gap-x-4 gap-y-1" v-if="!isEditing">
        <div class="flex-1">
          <BaseInputPassword v-model="user.password" label="Contraseña" :error="passwordError"
            @blur="$v.password.$touch()" />
        </div>
        <div class="flex-1">
          <BaseInputPassword v-model="confirmPassword" label="Confirmación" :error="confirmError"
            @blur="$v.confirmPassword.$touch()" />
        </div>
      </div>

      <!-- Rol -->
      <BaseSelect v-model="user.roleId" label="Rol" :options="userRoles" placeholder="Selecciona un Rol"
        :error="rolError" @blur="$v.roleId.$touch()" />

      <!-- Foto -->
      <input type="file" @change="handleImage" class="file-input file-input-bordered w-full max-w-xs" />

      <!-- Botones -->
      <BaseFormContainerActions @close="closeForm" @save="saveData" :is-editing="isEditing"
        :is-form-valid="isFormValid" />

    </div>
  </dialog>
</template>