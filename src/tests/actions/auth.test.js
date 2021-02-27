import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Swal from 'sweetalert2';

import { startChecking, startLogin, startRegister } from '../../actions/auth';
import { types } from '../../types/types';
import * as fetchModule from '../../helpers/fetch';

jest.mock('sweetalert2', () => ({
    fire: jest.fn()
}));

const middlewares = [ thunk ];
const mockStore = configureStore( middlewares );

const initState = {};
let store = mockStore( initState );

Storage.prototype.setItem = jest.fn();

describe('Pruebas en las acciones Auth', () => {
    
    beforeEach(() => {
        store = mockStore( initState );
        jest.clearAllMocks();
    });

    test('startLogin correcto', async() => {
        
        await store.dispatch( startLogin('pablo@pablo.com', 'pablo123') );

        const actions = store.getActions();

        expect( actions[0] ).toEqual({
            type: types.authLogin,
            payload: {
                uid: expect.any(String),
                name: expect.any(String)
            }
        });

        expect( localStorage.setItem ).toHaveBeenCalledWith('token', expect.any(String));
        expect( localStorage.setItem ).toHaveBeenCalledWith('token-init-date', expect.any(Number));

        // token = localStorage.setItem.mock.calls[0][1];

    });

    test('startLogin incorrecto', async() => {
        
        await store.dispatch( startLogin('pablo@pablo.com', 'pablo12') );
        let actions = store.getActions();

        expect( actions ).toEqual([]);
        expect( Swal.fire ).toHaveBeenCalledWith('Error', 'Password incorrecto', 'error');

        await store.dispatch( startLogin('pablo123@pablo.com', 'pablo123') );
        actions = store.getActions();

        expect( Swal.fire ).toHaveBeenCalledWith('Error', 'El usuario con ese correo no existe', 'error');
    });
    
    test('startRegister correcto', async() => {
        
        fetchModule.fetchSinToken = jest.fn(() => ({
            json() {
                return {
                    ok: true,
                    uid: '123',
                    name: 'prueba',
                    token: 'abc123abc123'
                }
            }
        }));

        await store.dispatch( startRegister('test@test.com', 'test123', 'test') );

        const actions = store.getActions();

        expect( actions[0] ).toEqual({
            type: types.authLogin,
            payload: {
                uid: '123',
                name: 'prueba'
            }
        });

        expect( localStorage.setItem ).toHaveBeenCalledWith('token', 'abc123abc123');
        expect( localStorage.setItem ).toHaveBeenCalledWith('token-init-date', expect.any(Number));

    });

    test('startChecking correcto', async () => {
        
        fetchModule.fetchConToken = jest.fn(() => ({
            json() {
                return {
                    ok: true,
                    uid: '123',
                    name: 'prueba',
                    token: 'abc123abc123'
                }
            }
        }));

        await store.dispatch( startChecking() );

        const actions = store.getActions();

        expect( actions[0] ).toEqual({
            type: types.authLogin,
            payload: {
                uid: '123',
                name: 'prueba'
            }
        });

        expect( localStorage.setItem ).toHaveBeenCalledWith('token', 'abc123abc123');

    });

});
