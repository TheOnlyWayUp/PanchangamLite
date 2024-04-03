<script>
	import { date } from '$lib/stores.js';
	import { to_human_date } from '$lib/utils.js';
</script>

<div class="bg-base-100 grid place-items-center p-4">
	<a class="my-2 text-2xl font-bold" href="/">Panchangam</a>

	{#if new Date($date).setHours(0, 0, 0, 0) != new Date().setHours(0, 0, 0, 0)}
		<p class="animate-pulse font-semibold">
			Today is <button class="underline" on:click={(e) => ($date = new Date())}
				>{to_human_date(new Date())}</button
			>
		</p>
	{/if}
	<div class="grid grid-cols-3">
		<button
			class="text-amber-600 transition-all hover:underline"
			on:click={(e) => {
				$date.setDate($date.getDate() - 1); // Thanks https://stackoverflow.com/a/9444776
				$date = $date;
			}}>{'<<'}</button
		>
		<div class="underline">
			{to_human_date($date)}
		</div>
		<button
			class="text-amber-600 transition-all hover:underline"
			on:click={(e) => {
				$date.setDate($date.getDate() + 1);
				$date = $date;
			}}>{'>>'}</button
		>
	</div>
	<!-- Thanks https://stackoverflow.com/a/71439534 ! -->
</div>
