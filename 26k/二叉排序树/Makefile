system_path := ../wajic

clang_flags := -isystem $(system_path)/system/include/libcxx -isystem $(system_path)/system/lib/libcxx/include -isystem $(system_path)/system/include/compat -isystem $(system_path)/system/include -isystem $(system_path)/system/include/libc -isystem $(system_path)/system/lib/libc/musl/include -isystem $(system_path)/system/lib/libc/musl/arch/emscripten -isystem $(system_path)/system/lib/libc/musl/arch/generic -Xlinker $(system_path)/system/system.bc -D__EMSCRIPTEN__ -D_LIBCPP_ABI_VERSION=2 -I $(system_path) -std=c++17 -Os -target wasm32 -nostartfiles -nodefaultlibs -nostdinc -nostdinc++ -Wno-unused-command-line-argument -DNDEBUG -D__WAJIC__ -fvisibility=hidden -fno-rtti -fno-exceptions -fno-threadsafe-statics -Xlinker -strip-all -Xlinker -gc-sections -Xlinker --no-entry -Xlinker -allow-undefined -Xlinker -export=__wasm_call_ctors -Xlinker -export=main -Xlinker -export=malloc -Xlinker -export=free

main.wasm: binary_search_tree.o
	clang ${clang_flags} -o main.wasm binary_search_tree.o

binary_search_tree.o: binary_search_tree.cpp binary_tree.hpp
	clang ${clang_flags} -c binary_search_tree.cpp


#binary_tree.o: binary_tree.cpp binary_tree.hpp
#	g++ ${gcc_flags} -c binary_tree.cpp

clean:
	rm -f *.o
	rm -f main.wasm
