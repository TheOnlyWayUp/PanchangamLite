<script>
	import { onMount } from 'svelte';
	import { nakshatram, location } from '../stores.js';
	import NakshatraluDropdown from './NakshatraluDropdown.svelte';
	import LocationsDropdown from './LocationsDropdown.svelte';

	onMount(async (e) => {
		if (!($nakshatram && $location)) {
			document.getElementById('welcome_modal').showModal();
		}
	});
</script>

<dialog id="welcome_modal" class="modal">
	<div class="modal-box">
		<h3 class="text-center text-lg font-bold">The Panchangam welcomes you</h3>
		<p class="py-4">
			An indispensable tool for Hindu Astrology, the Panchangam allows one to discern Tarabalam,
			find auspicious times, and avoid dangerous ones.
		</p>
		<p class="text-center">Ensure you consult the Panchangam when you start anything new!</p>

		<div class="grid place-items-center">
			<NakshatraluDropdown />
			<LocationsDropdown />
		</div>

		<div class="modal-action justify-center">
			<form method="dialog">
				<!-- if there is a button in form, it will close the modal -->
				<button class="btn btn-primary" disabled={!($nakshatram && $location)}>Check</button>
			</form>
		</div>
	</div>
</dialog>
