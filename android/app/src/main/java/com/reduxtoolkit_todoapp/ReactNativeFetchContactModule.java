package com.ReduxToolkit;

import android.annotation.SuppressLint;
import android.content.ContentProviderOperation;
import android.content.ContentResolver;
import android.content.Context;
import android.content.Intent;
import android.content.OperationApplicationException;
import android.database.Cursor;
import android.net.Uri;
import android.nfc.Tag;
import android.os.RemoteException;
import android.provider.ContactsContract;
import android.util.Log;
import android.view.View;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.google.gson.Gson;
import com.reduxtoolkit_todoapp.CustomModuleFetchContact;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

public class ReactNativeFetchContactModule extends ReactContextBaseJavaModule {


    public ReactNativeFetchContactModule(ReactApplicationContext context){
        super(context);
    }

    @NonNull
    @Override
    public String getName() {
        return "FetchContacts";
    }

    @ReactMethod
    public void fetchContactsAndroid(Callback successCallback)    {

          WritableMap arrayList = Arguments.createMap();
          WritableArray test_array = Arguments.createArray();

        Cursor cursor = getCurrentActivity().getContentResolver().query(ContactsContract.CommonDataKinds.Phone.CONTENT_URI,
                null, null, null,null);

        Uri postal_uri = ContactsContract.CommonDataKinds.StructuredPostal.CONTENT_URI;

        while(cursor.moveToNext()){
            Map<String,String> map=new HashMap<String,String>();
            Gson gson = new Gson();
            Cursor postal_cursor  = getCurrentActivity().getContentResolver().query(postal_uri,null,  null, null,null);

            @SuppressLint("Range")
            String name = cursor.getString(cursor.getColumnIndex(ContactsContract.CommonDataKinds.Phone.DISPLAY_NAME));
            @SuppressLint("Range")
            String mobile = cursor.getString(cursor.getColumnIndex(ContactsContract.CommonDataKinds.Phone.NUMBER));


            while(postal_cursor.moveToNext())
            {
                @SuppressLint("Range") String Strt = postal_cursor.getString(postal_cursor.getColumnIndex(ContactsContract.CommonDataKinds.StructuredPostal.STREET));
                @SuppressLint("Range") String Cty = postal_cursor.getString(postal_cursor.getColumnIndex(ContactsContract.CommonDataKinds.StructuredPostal.CITY));
                @SuppressLint("Range") String cntry = postal_cursor.getString(postal_cursor.getColumnIndex(ContactsContract.CommonDataKinds.StructuredPostal.COUNTRY));
                @SuppressLint("Range") String postalCode = postal_cursor.getString(postal_cursor.getColumnIndex(ContactsContract.CommonDataKinds.StructuredPostal.POSTCODE));
                @SuppressLint("Range") String state = postal_cursor.getString(postal_cursor.getColumnIndex(ContactsContract.CommonDataKinds.StructuredPostal.REGION));
                @SuppressLint("Range") String Cname = postal_cursor.getString(postal_cursor.getColumnIndex(ContactsContract.CommonDataKinds.Phone.DISPLAY_NAME));

                if(Cname.equals(name)){
                    map.put("street",Strt);
                    map.put("city",Cty);
                    map.put("country",cntry);
                    map.put("state",state);
                    map.put("postalCode",postalCode);
                }
            }
            map.put("name",name);
            map.put("mobile",mobile);
            String json = gson.toJson(map);
            test_array.pushString(json);
            arrayList.putString("contacts",json);
        }




        successCallback.invoke(test_array);
    }

    @ReactMethod
    public void buttonAddContact(ReadableMap readableMap) {

        String name = readableMap.getString("name");
        String mobile = readableMap.getString("mobile");

        ArrayList<ContentProviderOperation> contentProviderOperations = new ArrayList<ContentProviderOperation>();

        contentProviderOperations.add(ContentProviderOperation.newInsert(
                        ContactsContract.RawContacts.CONTENT_URI)
                .withValue(ContactsContract.RawContacts.ACCOUNT_TYPE, null)
                .withValue(ContactsContract.RawContacts.ACCOUNT_NAME, null)
                .build());

        // Adding Name
        contentProviderOperations.add(ContentProviderOperation
                .newInsert(ContactsContract.Data.CONTENT_URI)
                .withValueBackReference(ContactsContract.Data.RAW_CONTACT_ID, 0)
                .withValue(ContactsContract.Data.MIMETYPE,
                        ContactsContract.CommonDataKinds.StructuredName.CONTENT_ITEM_TYPE)
                .withValue(ContactsContract.CommonDataKinds.StructuredName.DISPLAY_NAME,
                        name)
                .build());

        // Adding Number
        contentProviderOperations.add(ContentProviderOperation
                .newInsert(ContactsContract.Data.CONTENT_URI)
                .withValueBackReference(ContactsContract.Data.RAW_CONTACT_ID, 0)
                .withValue(ContactsContract.Data.MIMETYPE,
                        ContactsContract.CommonDataKinds.Phone.CONTENT_ITEM_TYPE)
                .withValue(ContactsContract.CommonDataKinds.Phone.NUMBER,
                        mobile)
                .withValue(ContactsContract.CommonDataKinds.Phone.TYPE,
                        ContactsContract.CommonDataKinds.Phone.TYPE_WORK)
                .build());

        try {
            getCurrentActivity().getContentResolver().applyBatch(ContactsContract.AUTHORITY, contentProviderOperations);
        } catch (OperationApplicationException e) {
            e.printStackTrace();
        } catch (RemoteException e) {
            e.printStackTrace();
        }
    }

@ReactMethod
    public void buttonUpdateContact(ReadableMap readableMap) {

        String Cname = readableMap.getString("name");
        String Contactmobile = readableMap.getString("mobile");

        ArrayList<ContentProviderOperation> contentProviderOperations = new ArrayList<ContentProviderOperation>();
        contentProviderOperations.add(ContentProviderOperation
                .newUpdate(ContactsContract.Data.CONTENT_URI)
                .withSelection(ContactsContract.Data.DISPLAY_NAME + " = ? AND " +
                                ContactsContract.Data.MIMETYPE + " = ?",
                        new String[] { Cname,
                                ContactsContract.CommonDataKinds.Phone.CONTENT_ITEM_TYPE })
                .withValue(ContactsContract.CommonDataKinds.Phone.NUMBER,
                        Contactmobile)
                .withValue(ContactsContract.CommonDataKinds.Phone.TYPE,
                        ContactsContract.CommonDataKinds.Phone.TYPE_MOBILE)
                .build());

        try {
            getCurrentActivity().getContentResolver().applyBatch(ContactsContract.AUTHORITY, contentProviderOperations);
        } catch (OperationApplicationException e) {
            e.printStackTrace();
        } catch (RemoteException e) {
            e.printStackTrace();
        }
    }

    @SuppressLint("Range")
    @ReactMethod
    public void buttonDeletecontact(ReadableMap readableMap) {
        String nameDel = readableMap.getString("name");
        String mobileDel = readableMap.getString("mobile");
        Uri contactUri = Uri.withAppendedPath(ContactsContract.PhoneLookup.CONTENT_FILTER_URI, Uri.encode(mobileDel));
        Cursor cur = getCurrentActivity().getContentResolver().query(contactUri, null, null, null, null);
        try {
            if (cur.moveToFirst()) {
                do {
                    if (cur.getString(cur.getColumnIndex(ContactsContract.PhoneLookup.DISPLAY_NAME)).equalsIgnoreCase(nameDel)) {
                        String lookupKey = cur.getString(cur.getColumnIndex(ContactsContract.Contacts.LOOKUP_KEY));
                        Uri uri = Uri.withAppendedPath(ContactsContract.Contacts.CONTENT_LOOKUP_URI, lookupKey);
                        getCurrentActivity().getContentResolver().delete(uri, null, null);
                    }

                } while (cur.moveToNext());
            }

        } catch (Exception e) {
            System.out.println(e.getStackTrace());
        } finally {
            cur.close();
        }
    }

    @ReactMethod
    public void messageContact(ReadableMap redableMap) {
        String numberCall = redableMap.getString("mobile");
        String numberSms = redableMap.getString("message");

        Uri sms_uri = Uri.parse(String.format("smsto:%s",numberCall));
        Intent sms_intent = new Intent(Intent.ACTION_SENDTO, sms_uri);
        sms_intent.putExtra("sms_body", numberSms);
        getCurrentActivity().startActivity(sms_intent);

    }

    @ReactMethod
    public void callContact(ReadableMap redableMap) {
        String numberCall = redableMap.getString("mobile");
        Intent callIntent = new Intent(Intent.ACTION_CALL);
        callIntent.setData(Uri.parse(String.format("tel:%s",numberCall)));
        getCurrentActivity().startActivity(callIntent);
    }

    @ReactMethod
    public void videoCall(ReadableMap redableMap){
        String numberCall = redableMap.getString("mobile");
        Uri data = Uri.parse("tel:"+numberCall);

        Intent videoCall = new Intent("com.android.phone.videocall");
        videoCall.putExtra("videoCall", true);
        videoCall.setData(data);
        try{
            getCurrentActivity().startActivity(videoCall);
        }catch(Exception e){
            System.out.println(e.getStackTrace());
        }
    }

    @SuppressLint("Range")
    @ReactMethod
    public void updateAddress(ReadableMap readableMap) {

        String Cname = readableMap.getString("name");
        String Cnumber = readableMap.getString("mobile");
        String street = readableMap.getString("street");
        String city = readableMap.getString("city");
        String state = readableMap.getString("state");
        String country = readableMap.getString("country");
        String postalCode = readableMap.getString("postalCode");

        ArrayList<ContentProviderOperation> contentProviderOperations = new ArrayList<ContentProviderOperation>();

        contentProviderOperations.add(ContentProviderOperation.newInsert(
                        ContactsContract.RawContacts.CONTENT_URI)
                .withValue(ContactsContract.RawContacts.ACCOUNT_TYPE, null)
                .withValue(ContactsContract.RawContacts.ACCOUNT_NAME, null)
                .build());

        // Adding address
        contentProviderOperations.add(ContentProviderOperation
                .newInsert(ContactsContract.Data.CONTENT_URI)
                .withValueBackReference(ContactsContract.Data.RAW_CONTACT_ID, 0)
                .withValue(ContactsContract.Data.MIMETYPE,
                        ContactsContract.CommonDataKinds.StructuredPostal.CONTENT_ITEM_TYPE)
                .withValue(ContactsContract.CommonDataKinds.StructuredPostal.STREET,
                        street)
                .withValue(ContactsContract.CommonDataKinds.StructuredPostal.CITY, city)
                .withValue(ContactsContract.CommonDataKinds.StructuredPostal.REGION, state)
                .withValue(ContactsContract.CommonDataKinds.StructuredPostal.COUNTRY, country)
                .withValue(ContactsContract.CommonDataKinds.StructuredPostal.POSTCODE, postalCode)
                .build());

        // Adding Name
        contentProviderOperations.add(ContentProviderOperation
                .newInsert(ContactsContract.Data.CONTENT_URI)
                .withValueBackReference(ContactsContract.Data.RAW_CONTACT_ID, 0)
                .withValue(ContactsContract.Data.MIMETYPE,
                        ContactsContract.CommonDataKinds.StructuredName.CONTENT_ITEM_TYPE)
                .withValue(ContactsContract.CommonDataKinds.StructuredName.DISPLAY_NAME,
                        Cname)
                .build());

        // Adding Number
        contentProviderOperations.add(ContentProviderOperation
                .newInsert(ContactsContract.Data.CONTENT_URI)
                .withValueBackReference(ContactsContract.Data.RAW_CONTACT_ID, 0)
                .withValue(ContactsContract.Data.MIMETYPE,
                        ContactsContract.CommonDataKinds.Phone.CONTENT_ITEM_TYPE)
                .withValue(ContactsContract.CommonDataKinds.Phone.NUMBER,
                        Cnumber)
                .withValue(ContactsContract.CommonDataKinds.Phone.TYPE,
                        ContactsContract.CommonDataKinds.Phone.TYPE_WORK)
                .build());

        System.out.println(contentProviderOperations);

        try {
            getCurrentActivity().getContentResolver().applyBatch(ContactsContract.AUTHORITY, contentProviderOperations);
        } catch (OperationApplicationException e) {
            e.printStackTrace();
        } catch (RemoteException e) {
            e.printStackTrace();
        }
    }


    public long getContactId(String name) {
        long ret = -1;
        String selection = ContactsContract.CommonDataKinds.Phone.DISPLAY_NAME
                + " like'%" + name + "%'";
        String[] projection = new String[] { ContactsContract.CommonDataKinds.Phone.CONTACT_ID };
        Cursor c = getCurrentActivity().getContentResolver().query(
                ContactsContract.CommonDataKinds.Phone.CONTENT_URI,
                projection, selection, null, null);
        if (c.moveToFirst()) {
            ret = c.getLong(0);
        }
        c.close();

        return ret;
    }
}




























