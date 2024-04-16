<script>
	import { date, date_dropdown_open } from '$lib/stores.js';
	import { to_human_date } from '$lib/utils.js';
	import { DatePicker } from 'date-picker-svelte';
	import { format, subDays, addDays } from 'date-fns';

	let quotes = [
		'Regardless, the Supreme watches over us.',
		"The Supreme's blessings are always with us.",
		'The Supreme protects us.',
		'The gaze of Mother Goddess eradicates evil.'
	];

	$: {
		$date;
		$date_dropdown_open = false;
	}
</script>

<div class="bg-base-100 grid place-items-center p-4">
	<a class="my-2 text-2xl font-bold" href="/">Panchangam</a>
	<p>{quotes[(quotes.length * Math.random()) | 0]}</p>

	{#if new Date($date).setHours(0, 0, 0, 0) != new Date().setHours(0, 0, 0, 0)}
		<p class="animate-pulse font-semibold">
			Today is <button class="underline" on:click={(e) => ($date = new Date())}
				>{to_human_date(new Date())}</button
			>
		</p>
	{/if}
	<div class="mt-2 grid grid-cols-3">
		<button
			class="text-amber-600 transition-all hover:underline"
			on:click={(e) => {
				$date.setDate($date.getDate() - 1); // Thanks https://stackoverflow.com/a/9444776
				$date = $date;
			}}
			data-umami-event="Previous Day">{format(subDays($date, 1), 'E MMM dd')}</button
		>
		<details class="dropdown" bind:open={$date_dropdown_open} data-umami-event="Toggle Calendar">
			<summary class="btn m-1 w-fit text-nowrap">{format($date, 'E MMM dd')}</summary>
			<div class="dropdown-content z-[1]">
				<DatePicker bind:value={$date} format="MM dd yyyy" />
			</div>
		</details>
		<button
			class="text-amber-600 transition-all hover:underline"
			on:click={(e) => {
				$date.setDate($date.getDate() + 1);
				$date = $date;
			}}
			data-umami-event="Next Day">{format(addDays($date, 1), 'E MMM dd')}</button
		>
	</div>
	<!-- Thanks https://stackoverflow.com/a/71439534 ! -->
</div>
<!-- <div class="grid place-items-center">
	<div role="alert" class="alert bg-gradient-to-tr from-cyan-300 via-orange-300 to-blue-500">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			class="stroke-info h-6 w-6 shrink-0"
			><path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
			></path></svg
		>
		<span>We've launched a podcast!</span>
		<a href="..." class="btn btn-primary" target="_blank">Visit</a>
	</div>
</div> -->
