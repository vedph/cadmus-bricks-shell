import { Inject, Injectable, InjectionToken } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Proxy interceptor options.
 */
export interface ProxyInterceptorOptions {
  /**
   * The URL of the proxy endpoint.
   */
  proxyUrl: string;
  /**
   * The URLs to be intercepted by the proxy.
   */
  urls: string[];
}

/**
 * Injection token for the proxy interceptor options. Use this in your app
 * module like:
 * providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ProxyInterceptor, multi: true },
    { provide: PROXY_INTERCEPTOR_OPTIONS, useValue: {
        proxyUrl: 'http://myproxy.org',
        urls: [
          'http://lookup.dbpedia.org/api/search',
          'http://lookup.dbpedia.org/api/prefix'
        ]
      }
    },
  ]
 */
export const PROXY_INTERCEPTOR_OPTIONS =
  new InjectionToken<ProxyInterceptorOptions>('PROXY_INTERCEPTOR_OPTIONS');

/**
 * Proxy interceptor.
 */
@Injectable()
export class ProxyInterceptor implements HttpInterceptor {
  constructor(
    @Inject(PROXY_INTERCEPTOR_OPTIONS) private _options: ProxyInterceptorOptions
  ) {}

  /**
   * Intercept the request and replace the URL with the proxy URL if the
   * request URL starts with one of the URLs specified in the options.
   * Otherwise, the request is left unchanged.
   *
   * @param req The request.
   * @param next The next handler.
   * @returns Observable with the response.
   */
  public intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // check if the request is for the proxy
    if (this._options.urls.some((url) => req.url.startsWith(url))) {
      // create a new URL for your proxy endpoint
      const proxyUrl = `${this._options.proxyUrl}?uri=${encodeURIComponent(
        req.urlWithParams
      )}`;

      // clone the request and replace the URL
      const proxyReq = req.clone({ url: proxyUrl });

      // call the next handler with the new request
      return next.handle(proxyReq);
    }

    // if the request is not for the proxy, leave it unchanged
    return next.handle(req);
  }
}
