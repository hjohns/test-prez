<template>
  <v-tabs
    v-model="tab"
    align-tabs="title"
  >
  <nuxt-link to="/"><v-tab>Home</v-tab></nuxt-link>
  <nuxt-link to="/v/catalogs"><v-tab>VocPrez</v-tab></nuxt-link>
  <nuxt-link to="/c/catalogs"><v-tab>CatPrez</v-tab></nuxt-link>
  <nuxt-link to="/s/catalogs"><v-tab>SpacePrez</v-tab></nuxt-link>
  <nuxt-link to="/search"><v-tab>Search</v-tab></nuxt-link>
  <nuxt-link to="/sparql"><v-tab>SPARQL</v-tab></nuxt-link>
  <nuxt-link to="/profiles"><v-tab>Profiles</v-tab></nuxt-link>
  <nuxt-link to="/about"><v-tab>About</v-tab></nuxt-link>
  </v-tabs>
  <!-- <nav>
    <ul class="menu">
      <li><nuxt-link to="/">Home</nuxt-link></li>
      <li>
        <nuxt-link to="/catalogs">Catalogs</nuxt-link>
      </li>
      <li><nuxt-link to="/sparql">SPARQL</nuxt-link></li>
      <li><nuxt-link to="/debug">DEBUG</nuxt-link></li>
      <li><nuxt-link to="/about">About</nuxt-link></li>
    </ul>
  </nav> -->
</template>

<script setup>
import { RouterLink } from 'vue-router'; // Import RouterLink from Vue Router

// Export the component for use
</script>

<style scoped>

.v-tab {
  border-bottom:0 !important;
  color:#333 !important;
}

ul.menu,
ul.menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

/* Main menu styles */
ul.menu > li {
  display: inline-block;
  position: relative;
  margin-right: 20px;
}

ul.menu > li > a {
  text-decoration: none;
}

/* Submenu styles */
ul.menu ul {
  position: absolute;
  top: 100%;
  left: 0;
  display: none;
}

ul.menu li:hover > ul {
  display: block;
}

ul.menu ul li {
  display: block;
  width: 200px;
  background-color: #f0f0f0;
}

ul.menu ul a {
  padding: 10px;
  display: block;
  color: #333;
  text-decoration: none;
}

ul.menu ul a:hover {
  background-color: #ccc;
}
</style>