import handler from 'vinext/server/fetch-handler';

interface Env {
  STORE: KVNamespace;
  ASSETS: Fetcher;
}

export default {
  fetch(request:Request,env:Env,ctx:ExecutionContext):Promise<Response>{
    return handler.fetch(request,env,ctx);
  }
};
