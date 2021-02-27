import { fetchConToken, fetchSinToken } from "../../helpers/fetch";

describe('Pruebas en el helper Fetch', () => {
    
    let token = '';
    
    test('fetchSinToken debe funcionar', async() => {
        
        const res = await fetchSinToken('auth', { email: 'pablo@pablo.com', password: 'pablo123' }, 'POST' );
        
        expect( res instanceof Response ).toBe( true );

        const body = await res.json();
        expect( body.ok ).toBe( true );

        token = body.token;

    });

    test('fetchConToken debe funcionar', async() => {
        
        localStorage.setItem('token', token);

        const res = await fetchConToken('events/1', {}, 'DELETE');
        const body = await res.json();

        expect( body.msg ).toBe('Hable con el administrador');

    });

});
