<template>
  <div>
    <div class="col p-1 bg-info rounded text-center">
      <span>{{ tagLabel }}</span>
    </div>
  </div>
</template>

<script>
/**
 * @description Displays the Tag using a span inside a col.
 */
export default {
  name: "GodTagPill",
  components: {},
  props: {
    tagLabel: {
      type: String,
      required: true,
    },
  },
  data: function () {
    return {};
  },
  mounted: async function () {},
  computed: {},
  methods: {},
};
</script>
