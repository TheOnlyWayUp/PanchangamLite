<script>
	import NakshatraluDropdown from './NakshatraluDropdown.svelte';
	import LocationsDropdown from './LocationsDropdown.svelte';
</script>

<footer class="bg-neutral grid w-screen place-items-center text-center">
	<div class="grid grid-cols-2">
		<NakshatraluDropdown />
		<LocationsDropdown />
	</div>

	<p class="mt-10 w-full justify-center p-4 text-white">
		Copyright © 2024 - All rights reserved by <a
			href="https://rambhat.la"
			style="text-decoration: underline"
			class=" transition-all hover:text-purple-300 hover:underline-offset-2"
			data-umami-event="About Me">Dhanush Rambhatla</a
		>
	</p>

	<div class="grid w-full max-w-md grid-cols-2 p-2 text-white">
		<a href="https://panchangam.org/" target="_blank" class="link">Data Source</a>
		<a
			href="https://vijayalur.com/2011/10/02/tarabala-chandrabala-panchaka/"
			target="_blank"
			class="link">Tarabalam Source</a
		>
	</div>
</footer>
