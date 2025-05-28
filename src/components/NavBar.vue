<template>
    <nav class="navbar-modern navbar-expand-lg">
      <div class="container">
        <router-link to="/" class="navbar-brand d-flex align-items-center">
          <img src="https://upload.wikimedia.org/wikipedia/commons/1/1b/Flag_of_Croatia.svg"
               alt="Flag" class="brand-flag" />
          <span class="brand-text">Croatia WebGIS</span>
        </router-link>
  
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#modernNavbar"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
  
        <div class="collapse navbar-collapse" id="modernNavbar">
          <ul class="navbar-nav ms-auto">
            <li v-for="item in items" :key="item.name" class="nav-item">
              <router-link
                :to="item.path"
                class="nav-link"
                :class="{ active: $route.name === item.name }"
              >
                {{ item.label }}
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </template>
  
  <script setup>
  const items = [
    { name: 'home',    path: '/',        label: 'Home'    },
    { name:'webgis',  path:'/webgis',    label:'Map'     },
    { name: 'methods', path: '/methods', label: 'Methods' },
    { name: 'results', path: '/results', label: 'Results' },
    { name: 'team',    path: '/team',    label: 'Team'    },
    { name:'dataset', path:'/dataset',  label:'Dataset' },
  ]
  </script>
  
  <style scoped>
  .navbar-modern {
    position: sticky;
    top: 0;
    z-index: 1000;
    background: white;
    border-bottom-left-radius: 1.5rem;
    border-bottom-right-radius: 1.5rem;
    box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.08);
    padding: 0.75rem 0;
    transition: background 0.3s;
  }
  
  .navbar-modern .container {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .brand-flag {
    height: 1.6rem;
    margin-right: 0.5rem;
  }
  
  .brand-text {
    font-weight: 600;
    font-size: 1.1rem;
    color: #1864ab;
  }
  
  .navbar-modern .navbar-toggler {
    border: none;
  }
  
  .navbar-modern .navbar-toggler-icon {
    filter: invert(32%) sepia(44%) saturate(397%) hue-rotate(182deg)
      brightness(94%) contrast(89%);
  }
  
  .navbar-modern .navbar-nav .nav-link {
    margin: 0 0.5rem;
    padding: 0.5rem 1rem;
    color: #555;
    border-radius: 2rem;
    transition: background 0.3s, color 0.3s;
  }
  
  .navbar-modern .navbar-nav .nav-link:hover {
    background: rgba(24, 100, 171, 0.1);
    color: #1864ab;
  }
  
  .navbar-modern .navbar-nav .active {
    background: #1864ab;
    color: #fff !important;
  }
  
  @media (max-width: 992px) {
    .navbar-modern .navbar-nav {
      background: white;
      border-radius: 0 0 1.5rem 1.5rem;
      margin-top: 0.5rem;
      padding: 1rem;
    }
  }
  </style>
  