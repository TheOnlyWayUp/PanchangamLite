<script>
	import { location } from '$lib/stores.js';

	let locations = [
		'Hyderabad (India)',
		'Atlanta (USA)',
		'Chicago (USA)',
		'Houston (USA)',
		'New Jersey (USA)',
		'New York (USA)',
		'Toronto (Ontario)',
		'London (UK)',
		'Edinburgh (UK)',
		'Sydney (Australia)',
		'Melbourne (Australia)',
		'Perth (Australia)',
		'Durban (South Africa)',
		'Cape Town (South Africa)',
		'Munich (Germany)',
		'Singapore (Singapore)',
		'Kuala Lumpur (Malaysia)',
		'Dubai (UAE)',
		'Bangkok (Thailand)',
		'Hongkong (China)',
		'Riyadh (Saudi Arabia)',
		'Doha (Qatar)',
		'Kuwait City (Kuwait)',
		'Hamilton (New Zealand)',
		'Auckland (New Zealand)'
	];
</script>

<label class="form-control w-full max-w-xs">
	<div class="label">
		<span class="label-text">Current Location</span>
	</div>
	<select
		class="select select-bordered select-info"
		bind:value={$location}
		data-umami-event="Change Location"
	>
		<option disabled selected>City</option>
		<option class="text-black">{locations[0]}</option>
		{#each locations.slice(1).sort() as location}
			<option class="text-black">{location}</option>
		{/each}
	</select>
</label>
