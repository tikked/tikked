<template>
  <div>
    <div class="flex justify-between align-bottom mb-4">
      <h1 class="text-4xl mb-4">Environments</h1>
    </div>

    <div
      class="bg-white shadow-md w-full mb-4 p-4"
      v-for="environment in environments"
      :key="environment.id"
    >
      <h2 class="text-xl">
        {{ environment.name }}
        <span class="text-lg">({{ environment.id }})</span>
      </h2>
      <div class="mb-2">
        {{ environment.description }}
      </div>

      <h3 class="text-lg">Attributes:</h3>

      <table class="w-full text-sm mb-2">
        <thead>
          <tr class="border-b-2">
            <th class="text-left py-2 pl-2 font-semibold">Id</th>
            <th class="text-left py-2 pl-2 font-semibold">Name</th>
            <th class="text-left py-2 pl-2 font-semibold">Description</th>
            <th class="text-left py-2 px-2"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="attribute in environment.context" :key="attribute.id" class="border-b">
            <td class="py-2 pl-2">{{ attribute.id }}</td>
            <td class="py-2 pl-2">{{ attribute.name }}</td>
            <td class="py-2 pl-2">{{ attribute.description }}</td>
            <td class="pl-2">
              <button class="flex justify-center items-center h-8 w-8 ml-auto">
                <span class="mdi mdi-dots-horizontal" />
              </button>
            </td>
          </tr>
          <tr>
            <td class="py-1 pl-2">
              <input
                type="text"
                class="w-full h-full p-1 border border-gray-600"
                placeholder="Id"
              />
            </td>
            <td class="py-1 pl-2">
              <input
                type="text"
                class="w-full h-full p-1 border border-gray-600"
                placeholder="Id"
              />
            </td>
            <td class="py-1 pl-2">
              <input
                type="text"
                class="w-full h-full p-1 border border-gray-600"
                placeholder="Id"
              />
            </td>
            <td class="pl-2">
              <button class="flex justify-center items-center h-8 w-8 ml-auto">
                <span class="mdi mdi-dots-horizontal" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="flex justify-end">
        <button
          class="bg-blue-600 h-10 w-40 text-white hover:bg-blue-500 hover:shadow-md transition-all duration-200"
        >
          Manage toggles
        </button>
      </div>
    </div>

    <button
      class="border-dashed border-2 border-gray-400 w-full h-32 flex justify-center items-center hover:shadow-md hover:bg-gray-100 transition-all duration-200"
    >
      <span class="text-xl text-gray-600">Create new environment</span>
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      environments: [
        {
          id: 'st',
          name: 'Project System',
          description: 'A project system for projecting projects in a projectey way.',
          context: [
            {
              id: 'userId',
              name: 'User Id',
              description: 'The id of the user (mongo id)',
              weight: 1
            },
            {
              id: 'projectId',
              name: 'Project Id',
              description: 'The id of the study (mongo id)',
              weight: 2
            }
          ]
        }
      ]
    };
  },
  methods: {}
};
</script>
