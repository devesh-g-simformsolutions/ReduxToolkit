package com.ReduxToolkit;

import android.content.Intent;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class ReactNativeModuleAddContacts extends ReactContextBaseJavaModule {
    private static ReactApplicationContext reactApplicationContext;

    ReactNativeModuleAddContacts(ReactApplicationContext reactContext) {
        super(reactContext);
        reactApplicationContext = reactContext;
    }

    @NonNull
    @Override
    public String getName() {
        return "AddContact";
    }

    @ReactMethod
    public void addContact() {
        Intent intent = new Intent(reactApplicationContext, CustomModuleAddContact.class);
        getCurrentActivity().startActivity(intent);
    }
}
