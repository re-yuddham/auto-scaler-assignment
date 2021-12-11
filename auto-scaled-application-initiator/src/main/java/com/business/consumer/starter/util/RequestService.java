package com.business.consumer.starter.util;

import lombok.SneakyThrows;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.*;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.util.concurrent.ListenableFuture;
import org.springframework.util.concurrent.ListenableFutureCallback;
import org.springframework.web.client.AsyncRestTemplate;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.context.request.async.DeferredResult;


import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;

@Service public class RequestService {
	private static final Logger logger = LoggerFactory.getLogger(RequestService.class);

	@SneakyThrows @Async("taskExecutor") public CompletableFuture<ResponseEntity<String>> getAsyncResponse() {
		RestTemplate restTemplate = new RestTemplate();
		ResponseEntity<String> response;

		try {
			String requestJson = "{}";
			HttpEntity<String> entity = new HttpEntity<>(requestJson);
			HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();
			requestFactory.setConnectTimeout(0);
			requestFactory.setReadTimeout(0);
			restTemplate.setRequestFactory(requestFactory);
			response = restTemplate.exchange("https://auto-scale-app.cfapps.sap.hana.ondemand.com/oauth/token", HttpMethod.POST, entity, String.class);
		} catch (HttpClientErrorException httpClientErrorException) {
			logger.error(httpClientErrorException.getResponseBodyAsString(), httpClientErrorException);
			return CompletableFuture.completedFuture(ResponseEntity.status(httpClientErrorException.getStatusCode()).body(httpClientErrorException.getResponseBodyAsString()));
		}
		return CompletableFuture.completedFuture(ResponseEntity.status(response.getStatusCode()).body(response.getBody()));
	}

	public CompletableFuture asyncCall() {

		AsyncRestTemplate restTemplate = new AsyncRestTemplate();
		String baseUrl = "https://auto-scale-app.cfapps.sap.hana.ondemand.com/oauth/token";
		HttpHeaders requestHeaders = new HttpHeaders();
		String value = "";

		HttpEntity entity = new HttpEntity("parameters", requestHeaders);
		final DeferredResult<String> result = new DeferredResult<>();
		ListenableFuture<ResponseEntity<String>> futureEntity = restTemplate.postForEntity(baseUrl,null,String.class);
		return buildCompletableFuture(futureEntity);
	}
	public <T> CompletableFuture<T> buildCompletableFuture(
			final ListenableFuture<T> listenableFuture
	) {
		//create an instance of CompletableFuture
		CompletableFuture<T> completable = new CompletableFuture<T>() {
			@Override
			public boolean cancel(boolean mayInterruptIfRunning) {
				// propagate cancel to the listenable future
				boolean result = listenableFuture.cancel(mayInterruptIfRunning);
				super.cancel(mayInterruptIfRunning);
				return result;
			}
		};

		// add callback
		listenableFuture.addCallback(new ListenableFutureCallback<T>() {
			@Override
			public void onSuccess(T result) {
				completable.complete(result);
			}

			@Override
			public void onFailure(Throwable t) {
				completable.completeExceptionally(t);
			}
		});
		return completable;
	}

	public ResponseEntity<String> wreckUrl(Integer numberOfThreads, Integer numberOfRequests) {
		logger.info("start of method wreckUrl");
		int numberOfRequestsCompleted = 0;
		List<CompletableFuture> futureList = new ArrayList<>();
		//        while (numberOfRequestsCompleted < numberOfRequests) {
		futureList.clear();
		for (int i = 0; i < numberOfRequests; i++) {
			futureList.add(this.asyncCall());
			numberOfRequestsCompleted++;
			logger.info("Completed requests {} {}", numberOfRequestsCompleted, numberOfRequests);
		}
		CompletableFuture.allOf(futureList.toArray(new CompletableFuture[0])).join();
		//        }
		return ResponseEntity.status(HttpStatus.OK).body(null);
	}
}

