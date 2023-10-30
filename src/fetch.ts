const _importDynamic = new Function('modulePath', 'return import(modulePath)');

let defaultFetch:any;
export const fetch = async function (...args: any) {
    if(!defaultFetch){
        await main();
    }
    return defaultFetch(...args);
}

async function main(){
    const {default: fetch} = await _importDynamic('node-fetch');
    defaultFetch=fetch;
}
main()