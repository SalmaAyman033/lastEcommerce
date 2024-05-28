document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = form.name.value.trim();
        const passwordHash = form.passwordHash.value.trim();
        const phone = form.phone.value.trim();
        const email = form.email.value.trim();
        const street = form.street.value.trim();
        const apartment = form.apartment.value.trim();
        const zip = form.zip.value.trim();
        const city = form.city.value.trim();
        const country = form.country.value.trim();

        // Basic validation
        if (!name || !email || !passwordHash || !phone || !street || !zip || !city || !country) {
            console.log('Please fill in all required fields.');
            return;
        }

        try {
            const res = await fetch('/api/v1/user/register', {
                method: 'POST',
                body: JSON.stringify({ name, email, passwordHash, phone, street, apartment, zip, city, country }),
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            location.assign('/api/v1/user/login')


            const contentType = res.headers.get('Content-Type');
            if (contentType && contentType.includes('application/json')) {
                const data = await res.json();
                
                if (data.errors) {
                    console.log("Errors:", data.errors);
                    // Optionally, display errors to the user
                } else {
                    console.log("User registered successfully:", data);
                    // Optionally, redirect the user or display a success message
                }
            } else {
                const text = await res.text();
                console.log('Unexpected response format:', text);
            }
        } catch (err) {
            console.log('Fetch error:', err);
        }
    });
});
