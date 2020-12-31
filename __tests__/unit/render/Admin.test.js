describe('Login', () => {
    it('Should not fail on login', async () => {
        const admin = new Admin( );
        admin.login( 'matheus250504@gmail.com', 'teste' )
        .then( ( response ) => {
            expect( response.id ).toBe( 3 );
        } )
    });
});