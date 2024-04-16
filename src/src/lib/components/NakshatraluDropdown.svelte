<script>
	import { nakshatram } from '$lib/stores.js';
	import { nakshatralu } from '$lib/utils.js';
</script>

<label class="form-control w-full max-w-xs">
	<div class="label">
		<span class="label-text">Birth Star</span>
	</div>
	<select
		class="select select-bordered select-info"
		bind:value={$nakshatram}
		data-umami-event="Change Star"
	>
		<option disabled selected>Nakshatram</option>
		{#each Object.keys(nakshatralu).sort() as nakshatram}
			<option class="text-black">{nakshatram}</option>
		{/each}
	</select>
</label>
