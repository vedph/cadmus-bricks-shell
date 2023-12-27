# CadmusRefsDbpediaLookup

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.0.0.

DBPedia lookup is currently limited to the DBPedia API keyword lookup.

Essential types from DBPedia ontology:

- person: <http://dbpedia.org/ontology/Person>
- place: <http://dbpedia.org/ontology/Place>
- organisation: <http://dbpedia.org/ontology/Organisation>

Main properties:

- `docs` (array):
  - `resource`: array with (usually a single?) DBPedia URI.
  - `label`: array with (usually a single?) string.
  - `type`: array with DBPedia ontology types (you can use `typeName` to get their user friendly names, which are just the last token in the corresponding type URI).
  - `category`: array with DBPedia category URIs.
  - `comment`: array with comment.

Note that all the values may include `<B></B>` for bold, and presumably also `<I>` and `<U>`.

## Usage

To use this service, you must configure your app and use a proxy because AFAIK DBPedia does not support CORS nor JSONP.

(1) create a proxy API like this:

```cs
[ApiController]
[Route("api/proxy")]
public sealed class ProxyController : ControllerBase
{
    private readonly HttpClient _httpClient;

    public ProxyController(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    /// <summary>
    /// Gets the response from the specified URI.
    /// </summary>
    /// <param name="uri">The URI, e.g.
    /// <c>https://lookup.dbpedia.org/api/search?query=plato&format=json&maxResults=10</c>
    /// .</param>
    /// <returns>Response.</returns>
    [HttpGet]
    [ResponseCache(Duration = 60 * 10, VaryByQueryKeys = ["uri"], NoStore = false)]
    public async Task<IActionResult> Get([FromQuery] string uri)
    {
        try
        {
            HttpResponseMessage response = await _httpClient.GetAsync(uri);

            if (response.IsSuccessStatusCode)
            {
                string content = await response.Content
                    .ReadAsStringAsync();
                return Content(content, "application/json");
            }

            return StatusCode((int)response.StatusCode);
        }
        catch (Exception ex)
        {
            Debug.WriteLine(ex.ToString());
            return StatusCode(500, ex.Message);
        }
    }
}
```

This requires CORS, and the following services:

```cs
builder.Services.AddHttpClient();
builder.Services.AddResponseCaching();
```

and also this middleware (immediately after CORS):

```cs
app.UseResponseCaching();
```

(2) Once you provide this proxy endpoint, configure the Angular app like this:

```ts
{ provide: HTTP_INTERCEPTORS, useClass: ProxyInterceptor, multi: true },
{ provide: PROXY_INTERCEPTOR_OPTIONS, useValue: {
    proxyUrl: 'http://localhost:5161/api/proxy',
    urls: [
      'http://lookup.dbpedia.org/api/search',
      'http://lookup.dbpedia.org/api/prefix'
    ]
  }
},
```

This configures the proxy interceptor, whose task is intercepting requests to some services and rewrite them so that they are redirected to a proxy service. Using a proxy bypasses the issues of browsers in consuming services not providing support for CORS or JSONP.
