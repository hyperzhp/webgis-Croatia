<template>
    <section class="py-4">
      <h2 class="mb-4">Contact Us</h2>
      <form class="mx-auto" style="max-width:400px;" @submit.prevent="submit">
        <div class="mb-3">
          <label class="form-label">Name</label>
          <input v-model="form.name" type="text" class="form-control" required />
        </div>
        <div class="mb-3">
          <label class="form-label">Email</label>
          <input v-model="form.email" type="email" class="form-control" required />
        </div>
        <div class="mb-3">
          <label class="form-label">Message</label>
          <textarea v-model="form.message" rows="4" class="form-control" required></textarea>
        </div>
        <button type="submit" class="btn btn-primary">Send</button>
      </form>
    </section>
  </template>
  <script setup>
  import { reactive } from 'vue'
  const form = reactive({ name:'', email:'', message:'' })
  function submit() {
    alert('Thank you for your message! (Form not yet connected to backend)')
    form.name = form.email = form.message = ''
  }
  </script>
  