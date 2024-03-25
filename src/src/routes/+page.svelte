<script>
	let to_check_date = new Date();

	import { onMount } from 'svelte';
	let tara_data = {};
	let loaded = false;
	let selected_star = 'Chitra';
	let checked_date_string = '';

	if (!String.prototype.strip) {
		// ! Thanks https://stackoverflow.com/a/20890838
		String.prototype.strip = function (string) {
			var escaped = string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
			return this.replace(RegExp('^[' + escaped + ']+|[' + escaped + ']+$', 'gm'), '');
		};
	}

	async function update_data_for_(date) {
		loaded = false;

		let fetch_date = `${date.getFullYear()}-${date.getUTCMonth() + 1}-${date.getDate()}`;
		checked_date_string = fetch_date;

		let response = await fetch(`/?url=${btoa(fetch_date)}`);
		let html = await response.text();

		var parser = new DOMParser();

		// Parse the text
		var doc = parser.parseFromString(html, 'text/html');

		// You can now even select part of that html as you would in the regular DOM
		// Example:
		// var docArticle = doc.querySelector('article').innerHTML;

		doc.querySelectorAll('strong').forEach((el) => el.setAttribute('text', el.innerText)); // ! Thanks https://stackoverflow.com/a/59347108 fir tge udea

		function get_value(key) {
			return doc.querySelectorAll(`td:has(> strong[text*="${key}"]) + td`)[0].innerHTML;
		}

		// doc.querySelectorAll(`tr:has(> td:has(> strong[text*="Time to Avoid"]))`);

		let all_trs = Array.from(doc.querySelectorAll(`tr`));
		let avoid_title_tr = doc.querySelectorAll(`td:has(strong[text*="Time to Avoid"])`)[0]
			.parentElement;
		let good_time_title_tr = doc.querySelectorAll(`td:has(strong[text*="Good Time"])`)[0]
			.parentElement;
		all_trs.indexOf(avoid_title_tr);

		let bad_trs = all_trs.slice(all_trs.indexOf(avoid_title_tr));

		let good_trs = bad_trs
			.slice(all_trs.indexOf(good_time_title_tr) - all_trs.indexOf(avoid_title_tr))
			.slice(1, -1)
			.map((el) => Array.from(el.children).map((el) => el.innerText));

		bad_trs = bad_trs
			.slice(0, all_trs.indexOf(good_time_title_tr) - all_trs.indexOf(avoid_title_tr))
			.slice(1)
			.map((el) => Array.from(el.children).map((el) => el.innerText));

		let naks_times = get_value('Nakshatram').split('<br>');

		naks_times = naks_times.map(
			(el) =>
				el
					.split(/:(.*)/s)
					.slice(0, -1)
					.map((el) => el.strip(' ')) // ! Thanks https://stackoverflow.com/a/4607799
		);

		let data = {
			city: get_value('City'),
			naks: naks_times,
			good: good_trs,
			bad: bad_trs
		};
		console.log(data);

		tara_data = data;
		loaded = true;

		// Thanks https://stackoverflow.com/a/50812705

		const interval = setInterval(() => {
			time = new Date();
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	}

	onMount(async () => await update_data_for_(to_check_date));

	let where_taras = {
		Ashwini: 0,
		Magham: 0,
		Moolam: 0,
		Bharani: 1,
		'P.Phalguni': 1,
		'P.Shadha': 1,
		Kritika: 2,
		'U.Phalguni': 2,
		'U.Shadha': 2,
		Rohini: 3,
		Hasta: 3,
		Shravan: 3,
		Mrigashirish: 4,
		Chitra: 4,
		Dhanistha: 4,
		Ardra: 5,
		Swati: 5,
		Shatabhisha: 5,
		Punarvasu: 6,
		Vishakha: 6,
		'P.Bhadra': 6,
		Pushya: 7,
		Anuradha: 7,
		'U.Bhadra': 7,
		Ashlesha: 8,
		Jyestha: 8,
		Revati: 8
	};

	let nakshatralu = [
		['Ashwini', 'Magham', 'Moolam'],
		['Bharani', 'P.Phalguni', 'P.Shadha'],
		['Kritika', 'U.Phalguni', 'U.Shadha'],
		['Rohini', 'Hasta', 'Shravan'],
		['Mrigashirish', 'Chitra', 'Dhanistha'],
		['Ardra', 'Swati', 'Shatabhisha'],
		['Punarvasu', 'Vishakha', 'P.Bhadra'],
		['Pushya', 'Anuradha', 'U.Bhadra'],
		['Ashlesha', 'Jyestha', 'Revati']
	];

	let tarabalam = [
		[1, 2, 3, 4, 5, 6, 7, 8, 9],
		[9, 1, 2, 3, 4, 5, 6, 7, 8],
		[8, 9, 1, 2, 3, 4, 5, 6, 7],
		[7, 8, 9, 1, 2, 3, 4, 5, 6],
		[6, 7, 8, 9, 1, 2, 3, 4, 5],
		[5, 6, 7, 8, 9, 1, 2, 3, 4],
		[4, 5, 6, 7, 8, 9, 1, 2, 3],
		[3, 4, 5, 6, 7, 8, 9, 1, 2],
		[2, 3, 4, 5, 6, 7, 8, 9, 1]
	]; // https://vijayalur.files.wordpress.com/2011/10/tarabala-chakra.gif

	let num_status = {
		1: { name: 'Janma', status: 'bad' },
		2: { name: 'Sampath', status: 'very good' },
		3: { name: 'Vipat', status: 'bad' },
		4: { name: 'Kshema', status: 'good' },
		5: { name: 'Pratyak', status: 'very bad' },
		6: { name: 'Sadhana', status: 'very good' },
		7: { name: 'Naidhana', status: 'very bad' },
		8: { name: 'Mitra', status: 'very good' },
		9: { name: 'Parama Mitra', status: 'very good' }
	}; // https://vijayalur.files.wordpress.com/2011/10/tb-explained.gif

	function get_safety(nakshatram) {
		try {
			return num_status[tarabalam[where_taras[selected_star]][where_taras[nakshatram]]] || {};
		} catch (error) {
			return {};
		}
		return {};
	}

	let time = new Date(); // Thanks https://svelte.dev/repl/clock?version=4.2.10

	$: if (selected_star) {
		get_safety = get_safety;
	}
</script>

<!-- {fetch_url} -->
<!-- {JSON.stringify(tara_data)} -->

<div class="hero bg-base-200 min-h-screen">
	<div class="hero-content text-center">
		<div class="max-w-md">
			<div class="text-5xl font-thin">
				<h1>
					Date: <span class="font-normal"
						>{to_check_date.getDate()}/{to_check_date.getUTCMonth() +
							1}/{to_check_date.getFullYear()}</span
					>
				</h1>
				<h2 class="font-thin">
					It's now <span class="font-normal">{time.toTimeString().slice(0, 5)}</span>
				</h2>
			</div>
			<p class="py-6">
				{#if loaded}
					<div class="space-y-5">
						<h1 class="py-3 text-3xl font-medium">
							{tara_data.city}
							<a
								class="link font-normal"
								href={`https://panchangam.org/global/daily.php?city=Hyderabad&date=${checked_date_string}`}
								>(source)</a
							>
						</h1>
						<div class="flex w-full space-x-10">
							<button
								class="btn btn-secondary"
								on:click={async () => {
									to_check_date.setDate(to_check_date.getDate() - 1); // Thanks https://stackoverflow.com/a/9444776
									to_check_date = to_check_date;
									await update_data_for_(to_check_date);
								}}>Previous Day</button
							>
							<button
								class="btn btn-secondary"
								on:click={async () => {
									to_check_date = new Date();
									await update_data_for_(to_check_date);
								}}>Today</button
							>
							<button
								class="btn btn-secondary"
								on:click={async () => {
									to_check_date.setDate(to_check_date.getDate() + 1); // Thanks https://stackoverflow.com/a/9444776
									to_check_date = to_check_date;
									await update_data_for_(to_check_date);
								}}>Next Day</button
							>
						</div>

						<div class="space-y-2">
							<h2 class="text-2xl">Nakshatralu</h2>
							<ol class="list-disc text-left">
								{#each tara_data.naks as nakshatram}
									<li class="list-item text-xl">
										<div>
											<p>
												<strong>{nakshatram[0]}</strong> ({get_safety(nakshatram[0]).name}: {get_safety(
													nakshatram[0]
												).status}) {nakshatram[1]}
											</p>
										</div>
									</li>
								{/each}
							</ol>
						</div>

						<div class="space-y-2">
							<h2 class="text-2xl">Good Times</h2>
							<ol class="list-disc text-left">
								{#each tara_data.good as good}
									<li class="list-item text-xl">
										<div><p><strong>{good[0]}</strong> {good[1]}</p></div>
									</li>
								{/each}
							</ol>
						</div>

						<div class="space-y-2">
							<h2 class="text-2xl">Bad Times</h2>
							<ol class="list-disc text-left">
								{#each tara_data.bad as bad}
									<li class="list-item text-xl">
										<div><p><strong>{bad[0]}</strong> {bad[1]}</p></div>
									</li>
								{/each}
							</ol>
						</div>
					</div>
				{:else}
					Om, loading.
				{/if}
			</p>
			<label class="form-control">
				<div class="label">
					<span class="label-text">Select your Nakshatram</span>
				</div>
				<select
					class="select select-bordered select-primary w-full max-w-xs"
					bind:value={selected_star}
				>
					{#each Object.keys(where_taras) as tara}
						<option>{tara}</option>
					{/each}
				</select>
			</label>

			<p class="py-5">Scroll down for More Information.</p>
		</div>
	</div>
</div>
<footer class="footer footer-center bg-base-300 text-base-content sticky bottom-0 z-50 p-4">
	<aside>
		<p>
			Copyright © 2024 - All rights reserved by <a
				href="https://github.com/TheOnlyWayUp"
				class="link font-semibold">TheOnlyWayUp</a
			>. This is
			<a href="https://github.com/TheOnlyWayUp/PanchangamLite" class="link"
				>Free and Open-Source Software.</a
			>.
		</p>
	</aside>
</footer>

<h1 class="text-3xl font-medium">
	Data <a
		class="link font-normal"
		href="https://vijayalur.com/2011/10/02/tarabala-chandrabala-panchaka/">(source)</a
	>
</h1>

<div class="grid grid-cols-2">
	<img src="https://vijayalur.files.wordpress.com/2011/10/tarabala-chakra.gif" />
	<img src="https://vijayalur.files.wordpress.com/2011/10/tb-explained.gif" />
</div>
