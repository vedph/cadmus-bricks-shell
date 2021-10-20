@echo off
echo NPM PUBLISH
echo Before continuing, ensure that:
echo - you are logged in (npm whoami)
echo - you have successfully rebuilt all the libraries (npm run...)
pause

cd .\dist\myrmidon\cadmus-refs-asserted-id
call npm publish --access=public
cd ..\..\..
pause

cd .\dist\myrmidon\cadmus-refs-assertion
call npm publish --access=public
cd ..\..\..
pause

cd .\dist\myrmidon\cadmus-refs-chronotope
call npm publish --access=public
cd ..\..\..
pause

cd .\dist\myrmidon\cadmus-refs-decorated-ids
call npm publish --access=public
cd ..\..\..
pause

cd .\dist\myrmidon\cadmus-refs-doc-references
call npm publish --access=public
cd ..\..\..
pause

cd .\dist\myrmidon\cadmus-refs-external-ids
call npm publish --access=public
cd ..\..\..
pause

cd .\dist\myrmidon\cadmus-refs-historical-date
call npm publish --access=public
cd ..\..\..
pause

cd .\dist\myrmidon\cadmus-refs-proper-name
call npm publish --access=public
cd ..\..\..
pause

cd .\dist\myrmidon\cadmus-ui-flags-picker
call npm publish --access=public
cd ..\..\..
pause

echo ALL DONE
